import { GameHistory } from '../../../../shared/game'
import SecondaryButton from './SecondaryButton'

interface GameRecapProps {
  gameHistory: GameHistory,
}

const GameRecap = ( { gameHistory }: GameRecapProps) => {
  const size = gameHistory.size;
  return (
    <div className="border bg-white rounded-md px-8 py-4 flex flex-row justify-between items-center">
      <p className="text-xl">{gameHistory.outcome}</p>
      <div className="hidden sm:flex flex-row gap-8">
        <p className="text-sm">vs {gameHistory.opponent}</p>
        <p className="text-sm">{`Board size: ${size}x${size}x${size}`}</p>
      </div>
      <SecondaryButton onClick={() => console.log("click")}>REPLAY</SecondaryButton>
    </div>
  )
}

export default GameRecap
