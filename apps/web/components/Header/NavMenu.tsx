'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useJoinWaitlistModal } from '@/lib/useJoinWaitlistModal'
import { ThemeToggle } from './ThemeToggle'

export function NavMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { open: openModal } = useJoinWaitlistModal()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  return (
    <div ref={menuRef} className="relative md:hidden">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={cn(
          'absolute top-full right-0 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-background/95 shadow-lg backdrop-blur-md transition-all duration-200',
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="flex flex-col gap-1 p-2">
          <Link
            href="/blog"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            About
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false)
              openModal()
            }}
            className="cursor-pointer rounded-md px-3 py-2 text-left text-sm text-blue-400 transition-colors hover:bg-accent hover:text-blue-300"
          >
            Get Started
          </button>
          <div className="px-3 py-2">
            <ThemeToggle showLabel />
          </div>
        </nav>
      </div>
    </div>
  )
}
