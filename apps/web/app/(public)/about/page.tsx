import type { Metadata } from 'next'
import { GetEarlyAccessButton } from '@/components/GetEarlyAccessButton'

// static metadata injected into <head> by Next.js at build time
export const metadata: Metadata = {
  title: 'About — TechStartups.ai',
  description:
    'TechStartups.ai — AI-powered startup intelligence for job seekers, founders, and investors.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* hero */}
      <section className="mb-10">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">About</h1>
        <p className="mb-4 text-lg">{"Startup intelligence, before it's obvious."}</p>
        <p>
          {
            "The startup landscape moves fast. By the time a company shows up in a headline, the opportunity has already passed. TechStartups.ai exists to surface what's happening next — not what already happened."
          }
        </p>
      </section>

      <hr className="border-border" />

      {/* the gap */}
      <section className="my-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight">The Gap</h2>
        <p className="mb-4">
          {
            "The startup ecosystem has great tools for tracking what's already happened — funding rounds, headcounts, acquisitions. That historical record is essential, and it's well-served."
          }
        </p>
        <p>
          {
            "What's harder to find is what's happening next. The early signals that a company is gaining momentum. The patterns that predict a breakout before it makes headlines. That forward-looking layer is what's been missing — and it's what we're building."
          }
        </p>
      </section>

      <hr className="border-border" />

      {/* our approach */}
      <section className="my-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Our Approach</h2>
        <p className="mb-4">{'Forward-looking signals, not backward-looking records.'}</p>
        <p className="mb-6">
          {
            'We built TechStartups.ai around a simple premise: the most valuable startup intelligence is predictive. Our AI continuously harvests signals across hiring patterns, product launches, market positioning, and hundreds of other indicators to generate a real-time picture of where a company is heading.'
          }
        </p>
        <ul className="flex flex-col gap-3">
          <li>
            <strong className="text-foreground">Momentum Score</strong>
            {
              " — A composite, AI-generated score that captures a startup's forward trajectory — updated continuously, not quarterly."
            }
          </li>
          <li>
            <strong className="text-foreground">Signal Harvesting</strong>
            {
              ' — We monitor the signals that matter — job postings, product changes, press, funding patterns — and synthesize them into actionable intelligence.'
            }
          </li>
          <li>
            <strong className="text-foreground">Soonicorn Predictions</strong>
            {
              ' — Our prediction engine identifies the startups most likely to reach unicorn status before the market catches on.'
            }
          </li>
        </ul>
      </section>

      <hr className="border-border" />

      {/* who it's for */}
      <section className="my-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight">{"Who It's For"}</h2>
        <p className="mb-6">Three audiences. One platform.</p>
        <ul className="flex flex-col gap-3">
          <li>
            <strong className="text-foreground">Job Seekers</strong>
            {
              ' — Stop guessing which startups are worth joining. See which companies have real momentum, growing teams, and a trajectory that matches your career goals.'
            }
          </li>
          <li>
            <strong className="text-foreground">Founders</strong>
            {
              ' — Understand your competitive landscape in real time. Benchmark against companies at your stage, spot emerging threats, and find the right moment to make your move.'
            }
          </li>
          <li>
            <strong className="text-foreground">Angel Investors</strong>
            {
              " — Discover high-potential startups earlier. Our prediction engine and momentum signals surface the companies worth watching before they hit everyone else's radar."
            }
          </li>
        </ul>
      </section>

      <hr className="border-border" />

      {/* call to action */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight">{"See what's next."}</h2>
        <p className="mb-6">
          Join the waitlist for early access to startup intelligence that looks forward, not back.
        </p>
        <div className="flex justify-center">
          <GetEarlyAccessButton />
        </div>
      </section>
    </div>
  )
}
