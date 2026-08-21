import { useNavigate } from 'react-router-dom';
import MainButton from '../components/MainButton';
import { GameMode } from '../../../../shared/game';
import CenteredLayout from '../layouts/CenteredLayout';
import { useUsername } from '../../store/username';

const Home = () => {
  const navigate = useNavigate();

  const username = useUsername() ?? "stranger";

  const handleClick = (gameMode: GameMode) => {
    if (gameMode === "online") {
      navigate('/lobby');
      return;
    }
    navigate(`/game-settings?game-mode=${gameMode}`);
  };

  return (
    <CenteredLayout>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <p className="text-lg">{`Welcome back ${username}!`}</p>
          <p className="text-5xl font-ibm">Ready to play?</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <MainButton onClick={() => handleClick("online")}>PLAY ONLINE</MainButton>
          <MainButton onClick={() => handleClick("ai")}>PLAY VS AI</MainButton>
          <MainButton onClick={() => handleClick("local")}>PLAY LOCALLY</MainButton>
        </div>
      </div>
    </CenteredLayout>
  );
};

export default Home;
