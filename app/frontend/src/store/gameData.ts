import { create } from 'zustand'
import { GameData } from '../../../shared/game'

interface GameDataStore {
  gameData: GameData | null;
  setGameData: (gameData: GameData) => void;
}

const useGameDataStore = create<GameDataStore>()(
  (set) => ({
    gameData: null,
    setGameData: (gameData: GameData) => set({ gameData: gameData }),
  })
)

export const useGameData = () => useGameDataStore((state) => state.gameData);
export const useSetGameData = () => useGameDataStore((state) => state.setGameData);
