import { Body, Container, Head, Html, Preview, Text } from 'react-email'

interface AdminSignupNotificationProps {
  email: string
  userType?: string
}

// notification email sent to admin when a new user joins the waitlist
export default function AdminSignupNotification({ email, userType }: AdminSignupNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>{`New waitlist signup: ${email}`}</Preview>
      <Body>
        <Container>
          <Text>
            <strong>{'New waitlist signup'}</strong>
          </Text>
          <Text>{`Email: ${email}`}</Text>
          {userType ? <Text>{`User type: ${userType}`}</Text> : null}
        </Container>
      </Body>
    </Html>
  )
}
