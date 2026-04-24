import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'
import { Resend } from 'resend'
import { render } from 'react-email'
import { z } from 'zod'
import WaitlistConfirmation from '@techstartups/emails/WaitlistConfirmation'
import AdminSignupNotification from '@techstartups/emails/AdminSignupNotification'

const POSTGRES_UNIQUE_VIOLATION = '23505'

const waitlistSchema = z.object({
  email: z.email('Invalid email address'),
  user_type: z.string().nullable().optional(),
})

export async function POST(request: Request) {
  // parse the request body
  const body: unknown = await request.json()
  const result = waitlistSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // create a new waitlist entry
  const { email, user_type } = result.data
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )
  const { error: insertError } = await supabase.from('waitlist').insert({ email })

  // handle errors
  if (insertError) {
    if (insertError.code === POSTGRES_UNIQUE_VIOLATION) {
      // check if the user previously unsubscribed
      const { data: existing, error: selectError } = await supabase
        .from('waitlist')
        .select('unsubscribed_at')
        .eq('email', email)
        .single()

      if (selectError) {
        Sentry.captureException(selectError)
        return NextResponse.json({ error: 'Already on the waitlist' }, { status: 409 })
      }

      if (existing?.unsubscribed_at) {
        // resubscribe by clearing unsubscribed_at
        const { error: resubscribeError } = await supabase
          .from('waitlist')
          .update({ unsubscribed_at: null })
          .eq('email', email)

        if (resubscribeError) {
          Sentry.captureException(resubscribeError)
          return NextResponse.json(
            { error: 'Failed to join the waitlist. Please try again.' },
            { status: 500 }
          )
        }
      } else {
        return NextResponse.json({ error: 'Already on the waitlist' }, { status: 409 })
      }
    } else {
      Sentry.captureException(insertError)
      return NextResponse.json(
        { error: 'Failed to join the waitlist. Please try again.' },
        { status: 500 }
      )
    }
  }

  // render and send the waitlist confirmation and notification emails
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const [confirmationHtml, notificationHtml] = await Promise.all([
      render(<WaitlistConfirmation email={email} siteUrl={siteUrl} />),
      render(<AdminSignupNotification email={email} userType={user_type ?? undefined} />),
    ])

    await Promise.all([
      // send the waitlist confirmation email to the user
      resend.emails.send({
        from: 'TechStartups AI <hello@techstartups.ai>',
        to: email,
        subject: "You're on the TechStartups AI waitlist",
        html: confirmationHtml,
      }),

      // send a notification email to the admin
      resend.emails.send({
        from: 'TechStartups AI <hello@techstartups.ai>',
        to: 'evan@techstartups.ai',
        subject: 'New waitlist signup',
        html: notificationHtml,
      }),
    ])
  } catch (emailError) {
    Sentry.captureException(emailError)
  }

  return NextResponse.json({ success: true })
}
