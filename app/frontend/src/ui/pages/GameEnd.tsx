import HomeLayout from '../layouts/HomeLayout'
import { useGameData } from '../context/GameDataContext'
import { useUsername } from '../context/UsernameContext'
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
      <h1 className="text-5xl font-serif italic">{message}</h1>
    </HomeLayout>
  )
}

export default GameEnd
