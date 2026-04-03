'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FaLinkedin,
  FaXTwitter,
  FaProductHunt,
  FaAngellist,
  FaInstagram,
  FaReddit,
  FaTiktok,
  FaFacebook,
} from 'react-icons/fa6'
import { SiSubstack, SiBluesky, SiThreads } from 'react-icons/si'
import { cn } from '@/lib/utils'

const FOOTER_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const SOCIAL_LINKS = [
  { title: 'LinkedIn', href: 'https://www.linkedin.com/company/techstartups-ai', icon: FaLinkedin },
  { title: 'X / Twitter', href: 'https://x.com/techstartupsai', icon: FaXTwitter },
  {
    title: 'Bluesky',
    href: 'https://bsky.app/profile/techstartupsai.bsky.social',
    icon: SiBluesky,
  },
  {
    title: 'Product Hunt',
    href: 'https://www.producthunt.com/@techstartupsai',
    icon: FaProductHunt,
  },
  { title: 'Wellfound', href: 'https://wellfound.com/company/techstartups-ai', icon: FaAngellist },
  { title: 'Substack', href: 'https://substack.com/@techstartupsai', icon: SiSubstack },
  { title: 'Reddit', href: 'https://www.reddit.com/user/techstartupsai/', icon: FaReddit },
  { title: 'Instagram', href: 'https://www.instagram.com/techstartupsai/', icon: FaInstagram },
  { title: 'TikTok', href: 'https://www.tiktok.com/@techstartupsai', icon: FaTiktok },
  { title: 'Threads', href: 'https://www.threads.com/@techstartupsai', icon: SiThreads },
  { title: 'Facebook', href: 'https://www.facebook.com/techstartupsai', icon: FaFacebook },
]

export function Footer() {
  const pathname = usePathname()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Row 1 — social icons */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-5">
          {SOCIAL_LINKS.map(({ title, href, icon: Icon }) => (
            <a
              key={title}
              href={href}
              title={title}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        {/* Row 2 — wordmark / nav / copyright */}
        <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
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
      </div>
    </footer>
  )
}
