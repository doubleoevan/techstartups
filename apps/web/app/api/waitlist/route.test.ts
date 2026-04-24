import { describe, it, expect, vi, beforeEach } from 'vitest'

// hoisted mocks — available before vi.mock() factories execute
const mocks = vi.hoisted(() => {
  const mockSingle = vi.fn()
  const mockSelectEq = vi.fn(() => ({ single: mockSingle }))
  const mockSelect = vi.fn(() => ({ eq: mockSelectEq }))
  const mockInsert = vi.fn()
  const mockUpdateEq = vi.fn()
  const mockUpdate = vi.fn(() => ({ eq: mockUpdateEq }))
  const mockFrom = vi.fn(() => ({
    insert: mockInsert,
    select: mockSelect,
    update: mockUpdate,
  }))
  const mockEmailSend = vi.fn()
  const mockCaptureException = vi.fn()
  const mockRender = vi.fn()

  return {
    mockSingle,
    mockSelectEq,
    mockSelect,
    mockInsert,
    mockUpdateEq,
    mockUpdate,
    mockFrom,
    mockEmailSend,
    mockCaptureException,
    mockRender,
  }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mocks.mockFrom,
  })),
}))

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: mocks.mockEmailSend }
  },
}))

vi.mock('react-email', () => ({
  render: mocks.mockRender,
}))

vi.mock('@sentry/nextjs', () => ({
  captureException: mocks.mockCaptureException,
}))

vi.mock('@techstartups/emails/WaitlistConfirmation', () => ({
  default: vi.fn(() => null),
}))

vi.mock('@techstartups/emails/AdminSignupNotification', () => ({
  default: vi.fn(() => null),
}))

import { POST } from './route'

function createRequest(body: unknown): Request {
  return new Request('http://localhost/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/waitlist', () => {
  beforeEach(() => {
    // default: successful insert
    mocks.mockInsert.mockReturnValue({ error: null })

    // default: render returns mocked html
    mocks.mockRender.mockResolvedValue('<html>mocked</html>')

    // default: email send succeeds
    mocks.mockEmailSend.mockResolvedValue({ data: { id: 'email-id' }, error: null })

    // safe defaults for duplicate/re-subscribe path mocks — prevents order-dependent bugs
    mocks.mockSingle.mockReturnValue({ data: null, error: null })
    mocks.mockUpdateEq.mockReturnValue({ error: null })
  })

  it('returns 400 for an invalid email', async () => {
    const request = createRequest({ email: 'not-an-email' })
    const response = await POST(request)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body).toEqual({ error: 'Invalid email address' })
    expect(mocks.mockInsert).not.toHaveBeenCalled()
  })

  it('returns 400 for a missing email', async () => {
    const request = createRequest({})
    const response = await POST(request)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body).toEqual({ error: 'Invalid email address' })
    expect(mocks.mockInsert).not.toHaveBeenCalled()
  })

  it('inserts a new email and sends confirmation and admin emails', async () => {
    const request = createRequest({ email: 'new@example.com' })
    const response = await POST(request)

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ success: true })

    // verify the insert
    expect(mocks.mockInsert).toHaveBeenCalledWith({ email: 'new@example.com' })

    // verify both emails were sent with correct to, from, and subject
    expect(mocks.mockEmailSend).toHaveBeenCalledTimes(2)
    expect(mocks.mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'TechStartups AI <hello@techstartups.ai>',
        to: 'new@example.com',
        subject: "You're on the TechStartups AI waitlist",
        html: '<html>mocked</html>',
      })
    )
    expect(mocks.mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'TechStartups AI <hello@techstartups.ai>',
        to: 'evan@techstartups.ai',
        subject: 'New waitlist signup',
        html: '<html>mocked</html>',
      })
    )
  })

  it('returns 409 for a duplicate active email', async () => {
    // insert fails with unique violation
    mocks.mockInsert.mockReturnValue({
      error: { code: '23505', message: 'duplicate key' },
    })

    // existing row is not unsubscribed
    mocks.mockSingle.mockReturnValue({
      data: { unsubscribed_at: null },
      error: null,
    })

    const request = createRequest({ email: 'existing@example.com' })
    const response = await POST(request)

    expect(response.status).toBe(409)
    const body = await response.json()
    expect(body).toEqual({ error: 'Already on the waitlist' })
    expect(mocks.mockEmailSend).not.toHaveBeenCalled()
  })

  it('re-subscribes a previously unsubscribed email and preserves the existing row', async () => {
    // insert fails with unique violation
    mocks.mockInsert.mockReturnValue({
      error: { code: '23505', message: 'duplicate key' },
    })

    // existing row has unsubscribed_at set — include id and created_at to prove preservation
    mocks.mockSingle.mockReturnValue({
      data: {
        id: 'existing-uuid-abc123',
        created_at: '2025-01-15T10:30:00Z',
        unsubscribed_at: '2025-06-01T00:00:00Z',
      },
      error: null,
    })

    // re-subscribe update succeeds
    mocks.mockUpdateEq.mockReturnValue({ error: null })

    const request = createRequest({ email: 'returning@example.com' })
    const response = await POST(request)

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ success: true })

    // the existing row's id and created_at are preserved:
    // only one insert was attempted (which failed) — no new row was created
    expect(mocks.mockInsert).toHaveBeenCalledTimes(1)

    // the update only clears unsubscribed_at — it does not touch id or created_at
    expect(mocks.mockUpdate).toHaveBeenCalledWith({ unsubscribed_at: null })
    expect(mocks.mockUpdateEq).toHaveBeenCalledWith('email', 'returning@example.com')

    // verify no mutation included id or created_at fields
    for (const [argument] of mocks.mockInsert.mock.calls) {
      expect(argument).not.toHaveProperty('id')
      expect(argument).not.toHaveProperty('created_at')
    }
    for (const [argument] of mocks.mockUpdate.mock.calls) {
      expect(argument).not.toHaveProperty('id')
      expect(argument).not.toHaveProperty('created_at')
    }

    // confirmation and admin notification emails were sent
    expect(mocks.mockEmailSend).toHaveBeenCalledTimes(2)
    expect(mocks.mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'TechStartups AI <hello@techstartups.ai>',
        to: 'returning@example.com',
        subject: "You're on the TechStartups AI waitlist",
      })
    )
    expect(mocks.mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'TechStartups AI <hello@techstartups.ai>',
        to: 'evan@techstartups.ai',
        subject: 'New waitlist signup',
      })
    )
  })

  it('returns 500 when insert fails with a non-unique error', async () => {
    mocks.mockInsert.mockReturnValue({
      error: { code: '42P01', message: 'relation does not exist' },
    })

    const request = createRequest({ email: 'test@example.com' })
    const response = await POST(request)

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body).toEqual({ error: 'Failed to join the waitlist. Please try again.' })
    expect(mocks.mockCaptureException).toHaveBeenCalledWith(
      expect.objectContaining({ code: '42P01' })
    )
  })

  it('returns 500 when the re-subscribe update fails', async () => {
    // insert fails with unique violation
    mocks.mockInsert.mockReturnValue({
      error: { code: '23505', message: 'duplicate key' },
    })

    // existing row is unsubscribed
    mocks.mockSingle.mockReturnValue({
      data: { unsubscribed_at: '2025-06-01T00:00:00Z' },
      error: null,
    })

    // re-subscribe update fails
    const updateError = new Error('database connection lost')
    mocks.mockUpdateEq.mockReturnValue({ error: updateError })

    const request = createRequest({ email: 'returning@example.com' })
    const response = await POST(request)

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body).toEqual({ error: 'Failed to join the waitlist. Please try again.' })
    expect(mocks.mockCaptureException).toHaveBeenCalledWith(updateError)
    expect(mocks.mockEmailSend).not.toHaveBeenCalled()
  })

  it('returns success even when email sending fails', async () => {
    mocks.mockEmailSend.mockRejectedValue(new Error('Resend API down'))

    const request = createRequest({ email: 'new@example.com' })
    const response = await POST(request)

    // email failure is swallowed — user still gets success
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({ success: true })
    expect(mocks.mockCaptureException).toHaveBeenCalledWith(expect.any(Error))
  })
})
