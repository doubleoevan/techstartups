const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

// verify a Turnstile token against the Cloudflare siteverify endpoint
// returns true immediately if TURNSTILE_SECRET_KEY is unset (local-dev bypass)
export async function verifyTurnstileToken(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return true
  }

  if (!token) {
    return false
  }

  // post to cloudflare siteverify
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    })

    const data = (await response.json()) as { success: boolean }
    return data.success === true
  } catch {
    return false
  }
}
