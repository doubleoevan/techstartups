'use client'

import { useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { Button, Input } from '@techstartups/ui'
import { cn } from '@/lib/utils'

type UserType = 'jobSeeker' | 'founder' | 'investor'

interface Plan {
  name: string
  price: number | null
  isPopular?: boolean
  features: string[]
}

interface UserTier {
  id: UserType
  label: string
  icon: ReactNode
  tag: string
  description: string
  plans: Plan[]
}

const USER_TIERS: UserTier[] = [
  {
    id: 'jobSeeker',
    label: 'Job seeker',
    icon: '🎯',
    tag: 'Find stable, growing companies',
    description:
      'Find stable, growing companies before job postings go live. Hiring signals, runway health, culture analysis.',
    plans: [
      {
        name: 'Career',
        price: null,
        features: [
          'Browse startup profiles',
          'Basic momentum score',
          '3 AI snapshots/month',
          'Public leaderboard',
        ],
      },
      {
        name: 'Career Starter',
        price: 9,
        features: [
          'Full momentum score + trend',
          '20 AI snapshots/month',
          'Hiring signal alerts',
          'Salary estimates',
          'Watchlist (10 startups)',
        ],
      },
      {
        name: 'Career Pro',
        price: 19,
        isPopular: true,
        features: [
          'Unlimited AI snapshots',
          'Pre-signal alerts',
          'Layoff risk indicator',
          'Interview prep AI',
          'Unlimited watchlist',
        ],
      },
    ],
  },
  {
    id: 'founder',
    label: 'Founder',
    icon: <span className="inline-block -scale-x-100">🦄</span>,
    tag: 'Raise smarter, get discovered',
    description:
      'Raise smarter. Track competitors, get discovered by investors, close your round with AI-powered tools.',
    plans: [
      {
        name: 'Founder',
        price: null,
        features: ['Claim startup profile', 'Basic public page', 'Community feed', 'Blog access'],
      },
      {
        name: 'Founder Starter',
        price: 19,
        features: [
          'Full momentum score',
          'Competitor tracking (3)',
          'AI startup analysis',
          'Investor interest signals',
          'Fundraising Mode basic',
        ],
      },
      {
        name: 'Founder Pro',
        price: 49,
        isPopular: true,
        features: [
          'Unlimited competitors',
          'AI investor matching',
          'Private data room',
          'Pitch deck scoring',
          'Investor memo + term sheet AI',
        ],
      },
    ],
  },
  {
    id: 'investor',
    label: 'Investor',
    icon: '💎',
    tag: 'Find the next big thing early',
    description:
      "Source deals before they're obvious. Real-time deal flow, AI due diligence, direct founder introductions.",
    plans: [
      {
        name: 'Investor',
        price: null,
        features: [
          'Browse public profiles',
          'Basic momentum scores',
          'Public leaderboard',
          '3 AI deep dives/month',
        ],
      },
      {
        name: 'Investor Starter',
        price: 49,
        features: [
          'Unlimited AI deep dives',
          'Full momentum + trajectory',
          'Deal flow feed',
          'Thesis filter',
          'Due diligence reports',
        ],
      },
      {
        name: 'Investor Pro',
        price: 99,
        isPopular: true,
        features: [
          'Mutual opt-in intros',
          'Private data room',
          'Portfolio dashboard',
          'VC activity tracker',
          'API access',
        ],
      },
    ],
  },
]

export default function HomePage() {
  const [userType, setUserType] = useState<UserType | null>(null)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // handles user type click
  function onClickUserType(event: React.MouseEvent, type: UserType) {
    event.stopPropagation()
    const next = userType === type ? null : type
    setUserType(next)
    if (next) {
      document
        .getElementById(`pricing-${next}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // handles waitlist form submit
  async function onJoinWaitlist(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email || isLoading) {
      return
    }
    setIsLoading(true)
    setErrorMessage(null)

    // submit waitlist form
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, user_type: userType }),
      })
      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const data = (await response.json()) as { error?: string }
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col" onClick={() => setUserType(null)}>
      {/* Hero section */}
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-14 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Startup Intelligence,
          <span className="block text-primary">{"before it's obvious."}</span>
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground transition-all duration-300">
          Real momentum signals for job seekers, founders, and investors — powered by AI.
        </p>

        {/* User type pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {USER_TIERS.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={(event) => onClickUserType(event, id)}
              className={cn(
                'cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                userType === id
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              )}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Waitlist form */}
        <div id="waitlist" className="flex w-full max-w-md flex-col items-center gap-3">
          {!isSubmitted ? (
            <form onSubmit={onJoinWaitlist} className="flex w-full gap-2">
              <Input
                id="waitlist-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-card"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Joining…' : 'Join waitlist'}
              </Button>
            </form>
          ) : (
            <p className="font-medium text-foreground">
              {"You're on the list — we'll be in touch soon."}
            </p>
          )}
          {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          <p className="text-xs text-muted-foreground">
            14-day free trial at launch · No credit card needed to join the waitlist
          </p>
        </div>
      </section>

      {/* User type cards */}
      <section>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3">
          {USER_TIERS.map(({ id, icon, label, description }) => (
            <div
              key={id}
              onClick={(event) => onClickUserType(event, id)}
              className={cn(
                'cursor-pointer rounded-xl border border-border bg-card p-6 text-card-foreground transition-opacity duration-300',
                userType && userType !== id ? 'opacity-40' : 'opacity-100'
              )}
            >
              <div className="mb-3 text-3xl">{icon}</div>
              <h3 className="mb-2 font-semibold">{label}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border" />

      {/* Pricing plans */}
      <section id="pricing" className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Simple, transparent pricing</h2>
          <p className="text-muted-foreground">Pick your role. Combine any way you want.</p>
        </div>

        <div className="mx-auto mb-8 flex w-fit max-w-2xl items-start gap-3 rounded-xl border border-green-600/30 bg-green-500/10 px-5 py-4 text-sm text-green-700 dark:border-green-500/25 dark:text-green-400">
          <span className="mt-0.5 shrink-0">⚡</span>
          <p>
            Add a 2nd or 3rd role and
            <strong className="font-semibold text-green-600 dark:text-green-300"> save 25% </strong>
            on each. Go annual for another
            <strong className="font-semibold text-green-600 dark:text-green-300"> 20% off</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {USER_TIERS.map(({ id, icon, label, tag, plans }) => (
            <div
              key={id}
              id={`pricing-${id}`}
              className={cn(
                'flex scroll-mt-20 flex-col gap-4 transition-opacity duration-300',
                userType && userType !== id ? 'opacity-40' : 'opacity-100'
              )}
            >
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">
                  {icon} {label}
                </h3>
                <span className="text-sm text-muted-foreground">{tag}</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {plans.map(({ name, price, isPopular, features }) => (
                  <div
                    key={name}
                    className={cn(
                      'flex flex-col rounded-xl border p-5',
                      isPopular
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border bg-card'
                    )}
                  >
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-2xl font-bold">
                          {price === null ? 'Free' : `$${price}`}
                          {price !== null && (
                            <span className="text-sm font-normal text-muted-foreground">/mo</span>
                          )}
                        </p>
                      </div>
                      {isPopular && (
                        <span className="shrink-0 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                          Most popular
                        </span>
                      )}
                    </div>

                    <ul className="mb-6 flex flex-col gap-1.5 text-sm text-muted-foreground">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={isPopular ? 'default' : 'outline'}
                      className="mt-auto w-full"
                      onClick={() =>
                        (
                          document.getElementById('waitlist-email') as HTMLInputElement | null
                        )?.focus({ preventScroll: false })
                      }
                    >
                      {price === null ? 'Get started free' : 'Join waitlist'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
