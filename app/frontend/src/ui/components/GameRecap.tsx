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
  let opponent = gameHistory.opponent;
  if (opponent === "ai") {
    let level = "";
    switch (gameHistory.gameData.level) {
      case 1:
        level = "easy";
        break;
      case 2:
        level = "medium";
        break;
      case 3:
        level = "hard";
        break;
      default:
        console.log("ai difficulty couldn't be found");
    }
    if (level)
      opponent = `ai (${level})`
  }

  return (
    <div className="border bg-light-grey px-8 py-4 flex flex-row justify-between items-center">
      <p className="text-l">{gameHistory.outcome}</p>
      <div className="hidden sm:flex flex-row gap-12">
        <p className="text-xs">{`Opponent: ${opponent}`}</p>
        <p className="text-xs">{`Board size: ${size}x${size}x${size}`}</p>
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
