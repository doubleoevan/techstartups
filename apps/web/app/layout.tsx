import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { cn } from '@/lib/utils'
import { Header } from '@/components/Header'
import { JoinWaitlistModal } from '@/components/JoinWaitlistModal/JoinWaitlistModal'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export const metadata: Metadata = {
  title: 'TechStartups.ai — AI-Powered Startup Intelligence',
  description:
    "AI-powered momentum scoring for startups — before they're obvious. For founders building momentum, investors hunting deals, and job seekers finding the next breakout company.",
  openGraph: {
    title: 'TechStartups.ai — AI-Powered Startup Intelligence',
    description:
      "AI-powered momentum scoring for startups — before they're obvious. For founders building momentum, investors hunting deals, and job seekers finding the next breakout company. 🦄",
    url: 'https://techstartups.ai',
    siteName: 'TechStartups.ai',
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@techstartupsai',
    title: 'TechStartups.ai — AI-Powered Startup Intelligence',
    description:
      "AI-powered momentum scoring for startups — before they're obvious. For founders building momentum, investors hunting deals, and job seekers finding the next breakout company. 🦄",
    images: ['/opengraph-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('font-sans', geist.variable)} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            {children}
            <JoinWaitlistModal />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
