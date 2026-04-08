import type { Metadata } from 'next'

// static metadata injected into <head> by Next.js at build time
export const metadata: Metadata = {
  title: 'Blog — TechStartups.ai',
  description: 'Startup intelligence insights, product updates, and founder stories.',
}

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-12">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Blog</h1>
        <p>Startup intelligence insights, product updates, and founder stories.</p>
      </div>

      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-2xl">✍️</p>
        <p className="font-medium text-foreground">Posts coming soon</p>
        <p className="max-w-xs text-sm">
          {"We're working on our first posts."}
          <br />
          Check back at soon...
        </p>
      </div>
    </div>
  )
}
