import { useUsername } from '../../store/username'
import { GameData } from '../../types/game'
import { getGameEndMessage } from '../../utils/gameData'
import SecondaryButton from './SecondaryButton'

interface GameRecapProps {
  key: number,
  gameData: GameData,
}

// to be fixed once real data is fetched
const GameRecap = ({ gameData }: GameRecapProps) => {
  const username = useUsername();
  const result = getGameEndMessage(gameData, username)
  return (
    <div className="border rounded-md border-stone-400 px-8 py-4 flex justify-between items-center">
      <p className="text-xl">{result}</p>
      <div className="flex flex-col md:flex-row gap-2 md:gap-8">
        <p className="text-sm">against AI</p>
        <p className="text-sm">Board size: 3x3x3</p>
      </div>
      <SecondaryButton onClick={() => console.log("click")}>REPLAY</SecondaryButton>
    </div>
  )
}

export default GameRecap
