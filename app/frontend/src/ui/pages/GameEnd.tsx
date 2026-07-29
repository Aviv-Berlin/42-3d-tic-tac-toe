import HomeLayout from '../layouts/HomeLayout'
import { useGameData } from '../context/GameDataContext'
import { useUsername } from '../context/UsernameContext'
import MainButton from '../components/MainButton'
const GameEnd = () => {

  const gameDataContext = useGameData();
  const gameData = gameDataContext?.gameData;

  const usernameContext = useUsername();
  const username = usernameContext?.username;

  if (!gameData || !username) {
    console.log("missing gameData or username");
    return null;
  }

  let message;

  if (gameData?.isDraw) message = "IT'S A DRAW";
  else if (gameData?.winner?.username === username) message = "YOU WIN";
  else message = "YOU LOSE";

  return (
    <HomeLayout>
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-5xl font-serif italic">{message}</h1>
        <MainButton onClick={() => console.log("play again")}>Play Again</MainButton>
      </div>
    </HomeLayout>
  )
}

export default GameEnd
