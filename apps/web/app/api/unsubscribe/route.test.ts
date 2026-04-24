import { describe, it, expect, vi, beforeEach } from 'vitest'

// hoisted mocks — available before vi.mock() factories execute
const mocks = vi.hoisted(() => {
  const mockIs = vi.fn()
  const mockEq = vi.fn(() => ({ is: mockIs }))
  const mockUpdate = vi.fn(() => ({ eq: mockEq }))
  const mockFrom = vi.fn(() => ({
    update: mockUpdate,
  }))
  const mockCaptureException = vi.fn()
  const mockRedirect = vi.fn()

  return {
    mockIs,
    mockEq,
    mockUpdate,
    mockFrom,
    mockCaptureException,
    mockRedirect,
  }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mocks.mockFrom,
  })),
}))

vi.mock('@sentry/nextjs', () => ({
  captureException: mocks.mockCaptureException,
}))

// redirect throws to halt execution, matching real Next.js behavior
vi.mock('next/navigation', () => ({
  redirect: mocks.mockRedirect,
}))

import { NextRequest } from 'next/server'
import { GET } from './route'

function createUnsubscribeRequest(email?: string): NextRequest {
  const url = email
    ? `http://localhost/api/unsubscribe?email=${encodeURIComponent(email)}`
    : 'http://localhost/api/unsubscribe'
  return new NextRequest(url)
}

describe('GET /api/unsubscribe', () => {
  beforeEach(() => {
    // default: update succeeds
    mocks.mockIs.mockReturnValue({ error: null })

    // default: redirect throws to halt execution
    mocks.mockRedirect.mockImplementation((url: string): never => {
      throw new Error(`NEXT_REDIRECT:${url}`)
    })
  })

  it('redirects to /unsubscribed on successful unsubscribe', async () => {
    const request = createUnsubscribeRequest('test@example.com')

    await expect(GET(request)).rejects.toThrow('NEXT_REDIRECT:/unsubscribed')
    expect(mocks.mockRedirect).toHaveBeenCalledWith('/unsubscribed')
  })

  it('redirects to /unsubscribe/invalid when email is missing', async () => {
    const request = createUnsubscribeRequest()

    await expect(GET(request)).rejects.toThrow('NEXT_REDIRECT:/unsubscribe/invalid')
    expect(mocks.mockRedirect).toHaveBeenCalledWith('/unsubscribe/invalid')
    expect(mocks.mockUpdate).not.toHaveBeenCalled()
  })

  it('redirects to /unsubscribe/invalid for an invalid email', async () => {
    const request = createUnsubscribeRequest('not-valid')

    await expect(GET(request)).rejects.toThrow('NEXT_REDIRECT:/unsubscribe/invalid')
    expect(mocks.mockRedirect).toHaveBeenCalledWith('/unsubscribe/invalid')
    expect(mocks.mockUpdate).not.toHaveBeenCalled()
  })

  it('redirects to /unsubscribed even when the update fails', async () => {
    const updateError = new Error('database connection lost')
    mocks.mockIs.mockReturnValue({ error: updateError })

    const request = createUnsubscribeRequest('test@example.com')

    await expect(GET(request)).rejects.toThrow('NEXT_REDIRECT:/unsubscribed')
    expect(mocks.mockCaptureException).toHaveBeenCalledWith(updateError)
    expect(mocks.mockRedirect).toHaveBeenCalledWith('/unsubscribed')
  })

  it('calls supabase update with the correct filters', async () => {
    const request = createUnsubscribeRequest('test@example.com')

    await expect(GET(request)).rejects.toThrow('NEXT_REDIRECT:/unsubscribed')

    // verify the update targets the correct table and email
    expect(mocks.mockFrom).toHaveBeenCalledWith('waitlist')
    expect(mocks.mockUpdate).toHaveBeenCalledWith({
      unsubscribed_at: expect.any(String),
    })
    expect(mocks.mockEq).toHaveBeenCalledWith('email', 'test@example.com')
    expect(mocks.mockIs).toHaveBeenCalledWith('unsubscribed_at', null)
  })
})
