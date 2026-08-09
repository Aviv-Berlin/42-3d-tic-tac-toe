import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameData } from '../../../shared/game'

interface GameDataStore {
  gameData: GameData | null;
  setGameData: (gameData: GameData) => void;
}

const useGameDataStore = create<GameDataStore>()(
  persist(
    (set) => ({
      gameData: null,
      setGameData: (gameData: GameData) => set({ gameData: gameData }),
    }),
    { name: 'gameData' }
  )
)

export const useGameData = () => useGameDataStore((state) => state.gameData);
export const useSetGameData = () => useGameDataStore((state) => state.setGameData);
