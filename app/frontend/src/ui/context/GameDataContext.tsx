import { createContext, useContext, useState } from 'react'
import { PropsWithChildren } from 'react'
import { GameData } from '../../types/game'

interface GameDataContextType {
  gameData: GameData | null;
  setGameData: React.Dispatch<React.SetStateAction<GameData | null>>;
}

const GameDataContext = createContext<GameDataContextType | null>(null)

const GameDataProvider = ({ children }: PropsWithChildren) => {
  const [gameData, setGameData] = useState<GameData | null>(() => {
    const savedGameData = window.localStorage.getItem("gameData")
    return savedGameData ? JSON.parse(savedGameData) : null
  })

  return (
    <GameDataContext.Provider value={{ gameData, setGameData }}>
      {children}
    </GameDataContext.Provider>
  )
}

const useGameData = () => useContext(GameDataContext);

export { GameDataProvider, useGameData }
