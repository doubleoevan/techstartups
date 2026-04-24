import { Body, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from 'react-email'
import type { CSSProperties } from 'react'

interface WaitlistConfirmationProps {
  email: string
  siteUrl: string
}

// waitlist confirmation email sent to users after signing up
export default function WaitlistConfirmation({ email, siteUrl }: WaitlistConfirmationProps) {
  const unsubscribeUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(email)}`

  return (
    <Html>
      <Head />
      <Preview>{"You're on the TechStartups AI waitlist"}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* logo */}
          <Section style={{ marginBottom: '20px' }}>
            <div style={logoIconStyle}>{'🚀'}</div>
            <span style={logoTextStyle}>
              {'Tech'}
              <span style={{ color: '#6366f1' }}>{'Startups'}</span>
              {'.ai'}
            </span>
          </Section>

          {/* early access badge */}
          <div style={badgeStyle}>{'Early Access'}</div>

          {/* heading */}
          <Heading style={headingStyle}>{"You're on the list."}</Heading>

          {/* intro */}
          <Text style={introStyle}>
            {
              "Thanks for joining the TechStartups.ai early access waitlist. We're building an intelligence layer for the startup ecosystem \u2014 and you'll be among the first in."
            }
          </Text>

          <Hr style={dividerStyle} />

          {/* benefits */}
          <Section style={{ marginBottom: '36px' }}>
            <Text style={benefitStyle}>
              <span style={bulletDotStyle} />
              {'Early access to AI-powered startup profiles and momentum scores'}
            </Text>
            <Text style={benefitStyle}>
              <span style={bulletDotStyle} />
              {'Founding member pricing when we launch paid tiers'}
            </Text>
            <Text style={{ ...benefitStyle, margin: 0 }}>
              <span style={bulletDotStyle} />
              {"We'll notify you the moment the doors open"}
            </Text>
          </Section>

          {/* footer */}
          <Text style={footerStyle}>
            {'Sent from '}
            <Link href="mailto:hello@techstartups.ai" style={footerLinkStyle}>
              {'hello@techstartups.ai'}
            </Link>
            {" \u00b7 You're receiving this because you signed up at techstartups.ai \u00b7 "}
            <Link href={unsubscribeUrl} style={footerLinkStyle}>
              {'Unsubscribe'}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// styles
const bodyStyle: CSSProperties = {
  background: '#f4f3ef',
  padding: 0,
  margin: 0,
  fontFamily: 'sans-serif',
}

const containerStyle: CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '48px',
}

const logoIconStyle: CSSProperties = {
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
  borderRadius: '8px',
  display: 'inline-block',
  textAlign: 'center',
  lineHeight: '32px',
  fontSize: '16px',
  verticalAlign: 'middle',
}

const logoTextStyle: CSSProperties = {
  fontSize: '15px',
  fontWeight: 500,
  color: '#0f1117',
  verticalAlign: 'middle',
  paddingLeft: '6px',
}

const badgeStyle: CSSProperties = {
  display: 'inline-block',
  background: '#e8f0fe',
  color: '#3b5bdb',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '4px 10px',
  borderRadius: '100px',
  marginBottom: '24px',
}

const headingStyle: CSSProperties = {
  fontSize: '28px',
  fontWeight: 400,
  color: '#0f1117',
  lineHeight: 1.3,
  margin: '0 0 20px',
  fontFamily: 'Georgia, serif',
}

const introStyle: CSSProperties = {
  fontSize: '15px',
  color: '#4a5063',
  lineHeight: 1.7,
  margin: '0 0 16px',
}

const dividerStyle: CSSProperties = {
  border: 'none',
  borderTop: '1px solid #e0ded8',
  margin: '32px 0',
}

const benefitStyle: CSSProperties = {
  fontSize: '14px',
  color: '#3a3f52',
  lineHeight: 1.6,
  margin: '0 0 16px',
}

const bulletDotStyle: CSSProperties = {
  display: 'inline-block',
  width: '6px',
  height: '6px',
  background: '#6366f1',
  borderRadius: '50%',
  verticalAlign: 'middle',
  marginRight: '10px',
}

const footerStyle: CSSProperties = {
  fontSize: '12px',
  color: '#aaa',
  margin: 0,
  paddingTop: '24px',
  borderTop: '1px solid #e0ded8',
}

const footerLinkStyle: CSSProperties = {
  color: '#6366f1',
  textDecoration: 'none',
}
