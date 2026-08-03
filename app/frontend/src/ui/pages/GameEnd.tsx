import CenteredLayout from '../layouts/CenteredLayout'
import MainButton from '../components/MainButton'
import SecondaryButton from '../components/SecondaryButton'
import { useNavigate } from 'react-router-dom'
import { getGameEndMessage } from '../../utils/gameData'
import { useGameData } from '../../store/gameData'
import { useUsername } from '../../store/username'

const GameEnd = () => {
  const gameData = useGameData();
  const username = useUsername();

  const navigate = useNavigate();

  if (!gameData || !username) {
    console.log("missing gameData or username");
    return null;
  }

  const message = getGameEndMessage(gameData, username);
  const numMoves = gameData.moves.length;
  const gameLength = Math.floor((gameData.gameEnd - gameData.gameStart) / 1000);

  const handleBackToHome = () => {
    window.localStorage.removeItem('gameData');
    navigate('/');
  }

  return (
    <CenteredLayout>
      <div className="flex flex-col items-center gap-8">
        <div className="flex gap-4">
          <SecondaryButton onClick={handleBackToHome}>Back to Home</SecondaryButton>
          <SecondaryButton onClick={() => navigate("/replay")}>View Replay</SecondaryButton>
        </div>
        <h1 className="text-5xl font-serif italic text-center">{message}</h1>
        <MainButton onClick={() => console.log("play again")}>Play Again</MainButton>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-serif italic">Stats</h2>
          <p>Number of moves: {numMoves}</p>
          <p>Game duration: {gameLength} seconds</p>
        </div>
      </div>
    </CenteredLayout>
  )
}

export default GameEnd
