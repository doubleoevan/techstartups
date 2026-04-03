'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  showLabel?: boolean
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()

  function toggle() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex cursor-pointer items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
    >
      <Sun size={16} className="dark:hidden" />
      <Moon size={16} className="hidden dark:block" />
      {showLabel && (
        <>
          <span className="text-sm dark:hidden">Light</span>
          <span className="hidden text-sm dark:block">Dark</span>
        </>
      )}
    </button>
  )
}
