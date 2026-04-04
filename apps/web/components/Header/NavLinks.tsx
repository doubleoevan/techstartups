'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useJoinWaitlistModal } from '@/lib/useJoinWaitlistModal'
import { ThemeToggle } from './ThemeToggle'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
]

export function NavLinks() {
  const pathname = usePathname()
  const { open: openWaitlistModal } = useJoinWaitlistModal()

  return (
    <nav className="hidden items-center gap-8 md:flex">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-sm transition-colors',
              isActive
                ? 'font-semibold text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.label}
          </Link>
        )
      })}
      <button
        onClick={openWaitlistModal}
        className="text-sm text-blue-400 transition-colors hover:text-blue-300"
      >
        Get Started
      </button>
      <ThemeToggle />
    </nav>
  )
}
