import Link from 'next/link'
import { NavLinks } from './NavLinks'
import { NavMenu } from './NavMenu'

export function Header() {
  return (
    <header className="relative sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold text-foreground">
          🚀 TechStartups<span className="text-primary">.ai</span>
        </Link>
        <NavLinks />
        <NavMenu />
      </div>
    </header>
  )
}
