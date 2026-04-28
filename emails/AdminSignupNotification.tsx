import { Body, Container, Head, Html, Preview, Text } from 'react-email'

interface AdminSignupNotificationProps {
  email: string
  userTypes?: string[]
}

// notification email sent to admin when a new user joins the waitlist
export default function AdminSignupNotification({
  email,
  userTypes,
}: AdminSignupNotificationProps) {
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
          {userTypes && userTypes.length > 0 ? (
            <Text>{`User types: ${userTypes.join(', ')}`}</Text>
          ) : null}
        </Container>
      </Body>
    </Html>
  )
}
