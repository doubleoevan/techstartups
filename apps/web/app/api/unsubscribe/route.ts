import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const emailSchema = z.string().email()

const UNSUBSCRIBED_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Unsubscribed — TechStartups AI</title>
  <style>
    body{font-family:sans-serif;background:#f4f3ef;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
    .card{background:#fff;border-radius:12px;padding:48px;max-width:480px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,.08)}
    h1{font-size:24px;font-weight:400;color:#0f1117;margin:0 0 12px;font-family:Georgia,serif}
    p{font-size:15px;color:#4a5063;line-height:1.6;margin:0}
  </style>
</head>
<body>
  <div class="card">
    <h1>You've been unsubscribed.</h1>
    <p>We've removed your email from the TechStartups AI waitlist.</p>
  </div>
</body>
</html>`

const INVALID_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Invalid link — TechStartups AI</title>
  <style>
    body{font-family:sans-serif;background:#f4f3ef;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
    .card{background:#fff;border-radius:12px;padding:48px;max-width:480px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,.08)}
    h1{font-size:24px;font-weight:400;color:#0f1117;margin:0 0 12px;font-family:Georgia,serif}
    p{font-size:15px;color:#4a5063;line-height:1.6;margin:0}
  </style>
</head>
<body>
  <div class="card">
    <h1>Invalid unsubscribe link.</h1>
    <p>Please contact <a href="mailto:hello@techstartups.ai">hello@techstartups.ai</a> if you need help.</p>
  </div>
</body>
</html>`

const HTML_HEADERS = { 'Content-Type': 'text/html' }

export async function GET(request: NextRequest) {
  const emailParam = request.nextUrl.searchParams.get('email')
  const parseResult = emailSchema.safeParse(emailParam)

  if (!parseResult.success) {
    return new Response(INVALID_HTML, { status: 400, headers: HTML_HEADERS })
  }

  const email = parseResult.data

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )

  await supabase
    .from('waitlist')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('email', email)
    .is('unsubscribed_at', null)

  return new Response(UNSUBSCRIBED_HTML, { status: 200, headers: HTML_HEADERS })
}
