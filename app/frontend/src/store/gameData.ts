import { create } from 'zustand'
import { GameData } from '../types/game'

interface GameDataStore {
  gameData: GameData | null;
  setGameData: (gameData: GameData) => void;
}

const useGameDataStore = create<GameDataStore>((set) => ({
  gameData: window.localStorage.getItem('gameData') ? JSON.parse(window.localStorage.getItem('gameData')!) : null,
  setGameData: (gameData: GameData) => set({ gameData: gameData }),
}))

export const useGameData = () => useGameDataStore((state) => state.gameData);
export const useSetGameData = () => useGameDataStore((state) => state.setGameData);
