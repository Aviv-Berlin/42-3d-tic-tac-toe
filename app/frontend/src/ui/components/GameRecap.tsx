import { GameData } from '../../types/game'
import SecondaryButton from './SecondaryButton'

interface GameRecapProps {
  key: number,
  gameData: GameData,
}

const GameRecap = ({ gameData }: GameRecapProps) => {
  return (
    <div className="border rounded-md border-stone-400 p-4 flex gap-4">
      <p>WIN</p>
      <p>against AI</p>
      <p>Board size: 3x3x3</p>
      <SecondaryButton>REPLAY</SecondaryButton>
    </div>
  )
}

export default GameRecap
