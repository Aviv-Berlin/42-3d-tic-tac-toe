import { GameHistory } from '../../../../shared/game'
import SecondaryButton from './SecondaryButton';
import { useNavigate } from 'react-router-dom';
import { useSetGameData } from '../../store/gameData';

interface GameRecapProps {
  gameHistory: GameHistory,
}

const GameRecap = ( { gameHistory }: GameRecapProps) => {
  const size = gameHistory.size;
  const navigate = useNavigate();
  const setGameData = useSetGameData();

  return (
    <div className="border bg-light-grey px-8 py-4 flex flex-row justify-between items-center">
      <p className="text-xl">{gameHistory.outcome}</p>
      <div className="hidden sm:flex flex-row gap-12">
        <p className="text-sm">{`Opponent: ${ gameHistory.opponent }`}</p>
        <p className="text-sm">{`Board size: ${size}x${size}x${size}`}</p>
      </div>
	  <SecondaryButton onClick={() => {
		setGameData(gameHistory.gameData);
		navigate('/replay')}}
		>
			Replay
	  </SecondaryButton>
    </div>
  )
}

export default GameRecap
