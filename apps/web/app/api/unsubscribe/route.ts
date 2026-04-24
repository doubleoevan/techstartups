import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const emailSchema = z.email()

export async function GET(request: NextRequest) {
  // parse the email from query params
  const emailParam = request.nextUrl.searchParams.get('email')
  const parseResult = emailSchema.safeParse(emailParam)
  if (!parseResult.success) {
    redirect('/unsubscribe/invalid')
  }
  const email = parseResult.data

  // update the waitlist entry with the unsubscribed_at timestamp
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )
  const { error: updateError } = await supabase
    .from('waitlist')
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq('email', email)
    .is('unsubscribed_at', null)

  if (updateError) {
    Sentry.captureException(updateError)
  }

  redirect('/unsubscribed')
}
