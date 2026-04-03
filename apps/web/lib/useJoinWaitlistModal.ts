import { create } from 'zustand'

interface JoinWaitlistModalStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

/**
 * Global state and hooks to show and hide the Join Waitlist modal
 */
export const useJoinWaitlistModal = create<JoinWaitlistModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
