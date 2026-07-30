import CenteredLayout from '../layouts/CenteredLayout'
import { useGameData } from '../context/GameDataContext'
import { useUsername } from '../context/UsernameContext'
import MainButton from '../components/MainButton'
import SecondaryButton from '../components/SecondaryButton'
import { useNavigate } from 'react-router-dom'
const GameEnd = () => {

  const gameDataContext = useGameData();
  const gameData = gameDataContext?.gameData;

  const usernameContext = useUsername();
  const username = usernameContext?.username;

  const navigate = useNavigate();

  if (!gameData || !username) {
    console.log("missing gameData or username");
    return null;
  }

  let message;

  if (gameData?.isDraw) message = "IT'S A DRAW";
  else if (gameData?.winner?.username === username) message = "YOU WIN";
  else message = "YOU LOSE";

  return (
    <CenteredLayout>
      <div className="flex flex-col items-center gap-8">
        <div className="flex gap-4">
          <SecondaryButton onClick={() => navigate("/")}>Back to Home</SecondaryButton>
          <SecondaryButton onClick={() => navigate("/replay")}>View Replay</SecondaryButton>
        </div>
        <h1 className="text-5xl font-serif italic">{message}</h1>
        <p>Number of moves: 4</p>
        <MainButton onClick={() => console.log("play again")}>Play Again</MainButton>
      </div>
    </CenteredLayout>
  )
}

export default GameEnd
