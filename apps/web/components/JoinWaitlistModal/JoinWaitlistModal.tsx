'use client'

import { useState, useEffect, useRef } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { cn } from '@/lib/utils'
import { useJoinWaitlistModal } from '@/lib/useJoinWaitlistModal'
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'

type UserTypeValue = 'job_seeker' | 'founder' | 'investor'

type WaitlistErrorResponse = { error?: string }

const USER_TYPE_OPTIONS: { value: UserTypeValue; label: string }[] = [
  { value: 'job_seeker', label: 'Job Seeker' },
  { value: 'founder', label: 'Founder' },
  { value: 'investor', label: 'Investor' },
]

const USER_TYPE_LABELS: Record<UserTypeValue, string> = {
  job_seeker: 'Job Seeker',
  founder: 'Founder',
  investor: 'Investor',
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export function JoinWaitlistModal() {
  const { isOpen: isWaitlistModalOpen, close: closeWaitlistModal } = useJoinWaitlistModal()
  const [email, setEmail] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<UserTypeValue[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const rolesRef = useComboboxAnchor()
  const turnstileRef = useRef<TurnstileInstance>(null)

  // reset the form when the modal is closed
  useEffect(() => {
    if (!isWaitlistModalOpen) {
      setEmail('')
      setSelectedTypes([])
      setIsSubmitting(false)
      setIsSuccess(false)
      setErrorMessage('')
      turnstileRef.current?.reset()
    }
  }, [isWaitlistModalOpen])

  // close the modal on escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeWaitlistModal()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeWaitlistModal])

  async function onJoinWaitlist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    // grab the turnstile token at submit time
    const turnstileToken = turnstileRef.current?.getResponse()

    // submit the waitlist form
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          userTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
          turnstileToken,
        }),
      })

      // handle the response
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
      turnstileRef.current?.reset()
    }
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-200',
        isWaitlistModalOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeWaitlistModal}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 w-full max-w-md rounded-xl border border-border bg-background p-8 shadow-2xl transition-all duration-200',
          isWaitlistModalOpen ? 'scale-100' : 'scale-95'
        )}
      >
        <button
          onClick={closeWaitlistModal}
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
          <form onSubmit={onJoinWaitlist} className="flex flex-col gap-4">
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
              <label className="text-sm text-muted-foreground">{"I'm a... (optional)"}</label>
              <Combobox multiple value={selectedTypes} onValueChange={setSelectedTypes}>
                <ComboboxChips ref={rolesRef}>
                  <ComboboxValue>
                    {(values: UserTypeValue[]) =>
                      values.map((value) => (
                        <ComboboxChip key={value}>{USER_TYPE_LABELS[value]}</ComboboxChip>
                      ))
                    }
                  </ComboboxValue>
                  <ComboboxChipsInput placeholder="Select roles" />
                  <ComboboxTrigger className="ml-auto shrink-0" />
                </ComboboxChips>
                <ComboboxContent anchor={rolesRef}>
                  <ComboboxList>
                    {USER_TYPE_OPTIONS.map((option) => (
                      <ComboboxItem key={option.value} value={option.value}>
                        {option.label}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {turnstileSiteKey && (
              <div className="flex justify-center">
                <Turnstile ref={turnstileRef} siteKey={turnstileSiteKey} />
              </div>
            )}

            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="self-center rounded-lg bg-primary px-8 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Joining…' : 'Join waitlist'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
