import { create } from 'zustand'

interface UsernameStore {
  username: string;
  setUsername: (username: string) => void;
}

const useUsernameStore = create<UsernameStore>()(
  (set) => ({
    username: '',
    setUsername: (username: string) => set({ username: username }),
  })
)

export const useUsername = () => useUsernameStore((state) => state.username)
export const useSetUsername = () => useUsernameStore((state) => state.setUsername)
