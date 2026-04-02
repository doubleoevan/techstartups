'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const FOOTER_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  const pathname = usePathname()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <Link href="/" className="font-semibold text-foreground">
          TechStartups<span className="text-primary">.ai</span>
        </Link>
        <nav className="flex items-center gap-4">
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'transition-colors hover:text-foreground',
                pathname === href && 'font-medium text-foreground'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <p>© 2026 TechStartups AI</p>
      </div>
    </footer>
  )
}
