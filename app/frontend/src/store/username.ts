import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UsernameStore {
  username: string;
  setUsername: (username: string) => void;
}

const useUsernameStore = create<UsernameStore>()(
  persist(
    (set) => ({
      username: '',
      setUsername: (username: string) => set({ username: username }),
    }),
    { name: 'username' }
  )
)

export const useUsername = () => useUsernameStore((state) => state.username)
export const useSetUsername = () => useUsernameStore((state) => state.setUsername)
