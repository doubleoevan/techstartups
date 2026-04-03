import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — TechStartups.ai',
  description:
    'TechStartups.ai — AI-powered startup intelligence for job seekers, founders, and investors.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-12">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">About</h1>
        <p className="text-muted-foreground">Coming soon.</p>
      </div>
    </div>
  )
}
