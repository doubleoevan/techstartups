'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { NavLinks } from './NavLinks'
import { NavMenu } from './NavMenu'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  // toggle blur once the user scrolls past the top of the page
  useEffect(() => {
    function onPageScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    onPageScroll()
    window.addEventListener('scroll', onPageScroll, { passive: true })
    return () => window.removeEventListener('scroll', onPageScroll)
  }, [])

  return (
    <header
      className={cn(
        'relative sticky top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-200',
        isScrolled
          ? 'border-b border-border/40 bg-background/60 backdrop-blur-xl backdrop-saturate-150'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold text-foreground">
          <span className="text-2xl">🚀</span> TechStartups<span className="text-primary">.ai</span>
        </Link>
        <NavLinks />
        <NavMenu />
      </div>
    </header>
  )
}
