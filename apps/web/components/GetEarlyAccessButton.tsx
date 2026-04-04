'use client'

import { useJoinWaitlistModal } from '@/lib/useJoinWaitlistModal'
import { Button } from '@techstartups/ui'

// opens the join waitlist modal
export function GetEarlyAccessButton() {
  const { open: openWaitlistModal } = useJoinWaitlistModal()

  return <Button onClick={openWaitlistModal}>Get Early Access</Button>
}
