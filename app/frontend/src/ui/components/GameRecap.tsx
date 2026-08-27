import { GameHistory } from '../../../../shared/game'

interface GameRecapProps {
  gameHistory: GameHistory,
}

const GameRecap = ( { gameHistory }: GameRecapProps) => {
  const size = gameHistory.size;
  return (
    <div className="border bg-white rounded-md px-8 py-4 flex flex-row justify-between items-center">
      <p className="text-xl">{gameHistory.outcome}</p>
      <div className="hidden sm:flex flex-row gap-12">
        <p className="text-sm">{`Opponent: ${ gameHistory.opponent }`}</p>
        <p className="text-sm">{`Board size: ${size}x${size}x${size}`}</p>
      </div>
    </div>
  )
}

export default GameRecap
