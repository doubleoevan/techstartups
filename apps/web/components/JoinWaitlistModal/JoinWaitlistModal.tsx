'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useJoinWaitlistModal } from '@/lib/useJoinWaitlistModal'

type RoleValue = 'job_seeker' | 'founder' | 'investor' | ''

type WaitlistErrorResponse = { error?: string }

export function JoinWaitlistModal() {
  const { isOpen, close } = useJoinWaitlistModal()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<RoleValue>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setRole('')
      setIsSubmitting(false)
      setIsSuccess(false)
      setErrorMessage('')
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [close])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, user_type: role || null }),
      })

      const data = (await response.json()) as WaitlistErrorResponse

      if (!response.ok) {
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.')
      } else {
        setIsSuccess(true)
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-200',
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 w-full max-w-md rounded-xl border border-border bg-background p-8 shadow-2xl transition-all duration-200',
          isOpen ? 'scale-100' : 'scale-95'
        )}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          ✕
        </button>

        <h2 id="modal-title" className="mb-6 text-xl font-semibold text-foreground">
          Join the waitlist
        </h2>

        {isSuccess ? (
          <p className="text-sm text-green-500">
            {"You're on the list! Check your inbox for a confirmation email."}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-email" className="text-sm text-muted-foreground">
                Email
              </label>
              <input
                id="modal-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus:border-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-role" className="text-sm text-muted-foreground">
                Role (optional)
              </label>
              <select
                id="modal-role"
                value={role}
                onChange={(event) => setRole(event.target.value as RoleValue)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors outline-none focus:border-ring dark:[color-scheme:dark]"
              >
                <option value="">Select a role</option>
                <option value="job_seeker">Job Seeker</option>
                <option value="founder">Founder</option>
                <option value="investor">Investor</option>
              </select>
            </div>

            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Joining…' : 'Join waitlist'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
