import { beforeEach, vi } from 'vitest'

// shared env vars for all test files
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_SECRET_KEY = 'test-secret-key'
process.env.RESEND_API_KEY = 'test-resend-key'
process.env.NEXT_PUBLIC_SITE_URL = 'https://test.techstartups.ai'

// reset all mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})
