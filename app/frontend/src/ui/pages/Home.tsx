import { useNavigate } from 'react-router-dom';
import { useUsername } from '../context/UsernameContext'
import { useGameData } from '../context/GameDataContext'
import MainButton from '../components/MainButton';
import { GameMode } from '../../types/game';
import HomeLayout from '../layouts/HomeLayout';

const Home = () => {
  const navigate = useNavigate();

  const userInfo = useUsername();
  const username = userInfo ? userInfo.username : "stranger";

  const handleClick = (gameMode: GameMode) => {
    if (gameMode === "online") {
      navigate('/lobby');
      return;
    }
    navigate(`/game-settings?game-mode=${gameMode}`);
  };

  const gameData = useGameData();

  console.log(gameData)

  return (
    <HomeLayout>
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-2">
          <p className="text-lg">{`Welcome back ${username}!`}</p>
          <p className="text-5xl font-serif italic">Ready to play?</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <MainButton onClick={() => handleClick("online")}>PLAY ONLINE</MainButton>
          <MainButton onClick={() => handleClick("ai")}>PLAY VS AI</MainButton>
          <MainButton onClick={() => handleClick("local")}>PLAY LOCALLY</MainButton>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Home;
