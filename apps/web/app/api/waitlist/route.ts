import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { z } from 'zod'

const POSTGRES_UNIQUE_VIOLATION = '23505'

const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  user_type: z.string().nullable().optional(),
})

export async function POST(request: Request) {
  const body: unknown = await request.json()
  const result = waitlistSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const { email, user_type } = result.data

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )

  const { error: insertError } = await supabase.from('waitlist').insert({ email })

  if (insertError) {
    // Postgres unique violation
    if (insertError.code === POSTGRES_UNIQUE_VIOLATION) {
      return NextResponse.json({ error: 'Already on the waitlist' }, { status: 409 })
    }
    console.error('Waitlist insert error:', insertError)
    return NextResponse.json(
      { error: 'Failed to join the waitlist. Please try again.' },
      { status: 500 }
    )
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  await Promise.all([
    resend.emails.send({
      from: 'TechStartups AI <hello@techstartups.ai>',
      to: email,
      subject: "You're on the TechStartups AI waitlist",
      html: `
        <div style="background:#f4f3ef;padding:0;margin:0;font-family:sans-serif;">
          <div style="max-width:560px;margin:0 auto;padding:48px;">

            <div style="margin-bottom:20px;">
              <div style="width:32px;height:32px;background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:8px;display:inline-block;text-align:center;line-height:32px;font-size:16px;vertical-align:middle;">🚀</div>
              <span style="font-size:15px;font-weight:500;color:#0f1117;vertical-align:middle;padding-left:6px;">Tech<span style="color:#6366f1;">Startups</span>.ai</span>
            </div>

            <div style="display:inline-block;background:#e8f0fe;color:#3b5bdb;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border-radius:100px;margin-bottom:24px;">Early Access</div>
            <h1 style="font-size:28px;font-weight:400;color:#0f1117;line-height:1.3;margin:0 0 20px;font-family:Georgia,serif;">You're on the list.</h1>
            <p style="font-size:15px;color:#4a5063;line-height:1.7;margin:0 0 16px;">Thanks for joining the TechStartups.ai early access waitlist. We're building an intelligence layer for the startup ecosystem — and you'll be among the first in.</p>

            <hr style="border:none;border-top:1px solid #e0ded8;margin:32px 0;" />

            <div style="margin-bottom:36px;">
              <p style="font-size:14px;color:#3a3f52;line-height:1.6;margin:0 0 16px;"><span style="display:inline-block;width:6px;height:6px;background:#6366f1;border-radius:50%;vertical-align:middle;margin-right:10px;"></span>Early access to AI-powered startup profiles and momentum scores</p>
              <p style="font-size:14px;color:#3a3f52;line-height:1.6;margin:0 0 16px;"><span style="display:inline-block;width:6px;height:6px;background:#6366f1;border-radius:50%;vertical-align:middle;margin-right:10px;"></span>Founding member pricing when we launch paid tiers</p>
              <p style="font-size:14px;color:#3a3f52;line-height:1.6;margin:0;"><span style="display:inline-block;width:6px;height:6px;background:#6366f1;border-radius:50%;vertical-align:middle;margin-right:10px;"></span>We'll notify you the moment the doors open</p>
            </div>

            <p style="font-size:12px;color:#aaa;margin:0;padding-top:24px;border-top:1px solid #e0ded8;">Sent from <a href="mailto:hello@techstartups.ai" style="color:#6366f1;text-decoration:none;">hello@techstartups.ai</a> · You're receiving this because you signed up at techstartups.ai · <a href="https://techstartups.ai/api/unsubscribe?email=${encodeURIComponent(email)}" style="color:#6366f1;text-decoration:none;">Unsubscribe</a></p>

          </div>
        </div>
      `,
    }),
    resend.emails.send({
      from: 'TechStartups AI <hello@techstartups.ai>',
      to: 'evan@techstartups.ai',
      subject: 'New waitlist signup',
      html: `
        <p><strong>New waitlist signup</strong></p>
        <p>Email: ${email}</p>
        ${user_type ? `<p>User type: ${user_type}</p>` : ''}
      `,
    }),
  ])

  return NextResponse.json({ success: true })
}
