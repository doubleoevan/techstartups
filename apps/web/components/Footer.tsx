export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <span className="font-semibold text-foreground">
          TechStartups<span className="text-primary">.ai</span>
        </span>
        <nav className="flex items-center gap-4">
          <a href="/" className="transition-colors hover:text-foreground">
            Privacy
          </a>
          <a href="/" className="transition-colors hover:text-foreground">
            Terms
          </a>
          <a href="/" className="transition-colors hover:text-foreground">
            Blog
          </a>
          <a
            href="mailto:hello@techstartups.ai"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </nav>
        <p>© 2026 TechStartups AI</p>
      </div>
    </footer>
  )
}
