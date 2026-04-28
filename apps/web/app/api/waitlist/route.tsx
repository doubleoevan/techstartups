import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'
import { Resend } from 'resend'
import { render } from 'react-email'
import { z } from 'zod'
import WaitlistConfirmation from '@techstartups/emails/WaitlistConfirmation'
import AdminSignupNotification from '@techstartups/emails/AdminSignupNotification'
import { verifyTurnstileToken } from '@/lib/turnstile'

const POSTGRES_UNIQUE_VIOLATION = '23505'

const userTypeEnum = z.enum(['job_seeker', 'founder', 'investor'])

const waitlistSchema = z.object({
  email: z.email('Invalid email address'),
  userTypes: z.array(userTypeEnum).min(1).max(3).optional(),
  turnstileToken: z.string().optional(),
})

export async function POST(request: Request) {
  // parse the request body
  const body: unknown = await request.json()
  const result = waitlistSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // verify the turnstile token
  const { email, userTypes, turnstileToken } = result.data
  const isHuman = await verifyTurnstileToken(turnstileToken)
  if (!isHuman) {
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 400 })
  }

  // create a new waitlist entry
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )
  const insertData: Record<string, unknown> = { email }
  if (userTypes) {
    insertData.user_types = userTypes
  }
  const { error: insertError } = await supabase.from('waitlist').insert(insertData)

  // handle errors
  if (insertError) {
    if (insertError.code === POSTGRES_UNIQUE_VIOLATION) {
      // check if the user previously unsubscribed
      const { data: existing, error: selectError } = await supabase
        .from('waitlist')
        .select('unsubscribed_at, user_types')
        .eq('email', email)
        .single()

      if (selectError) {
        Sentry.captureException(selectError)
        return NextResponse.json({ error: 'Already on the waitlist' }, { status: 409 })
      }

      // build the update payload
      const updateData: Record<string, unknown> = {}
      if (existing?.unsubscribed_at) {
        updateData.unsubscribed_at = null
      }
      if (userTypes) {
        updateData.user_types = userTypes
      }

      // nothing to update — active subscriber with no new types
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: 'Already on the waitlist' }, { status: 409 })
      }

      const { error: updateError } = await supabase
        .from('waitlist')
        .update(updateData)
        .eq('email', email)

      if (updateError) {
        Sentry.captureException(updateError)
        return NextResponse.json(
          { error: 'Failed to join the waitlist. Please try again.' },
          { status: 500 }
        )
      }
    } else {
      Sentry.captureException(insertError)
      return NextResponse.json(
        { error: 'Failed to join the waitlist. Please try again.' },
        { status: 500 }
      )
    }
  }

  // build the admin notification email subject
  const adminSubject =
    userTypes && userTypes.length > 0
      ? `New waitlist signup (${userTypes.join(', ')}): ${email}`
      : 'New waitlist signup'

  // render and send the waitlist confirmation and notification emails
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const [confirmationHtml, notificationHtml] = await Promise.all([
      render(<WaitlistConfirmation email={email} siteUrl={siteUrl} />),
      render(<AdminSignupNotification email={email} userTypes={userTypes} />),
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
        subject: adminSubject,
        html: notificationHtml,
      }),
    ])
  } catch (emailError) {
    Sentry.captureException(emailError)
  }

  return NextResponse.json({ success: true })
}
