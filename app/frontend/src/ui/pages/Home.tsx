import { useNavigate } from 'react-router-dom';
import MainButton from '../components/MainButton';
import { GameMode } from '../../../../shared/game';
import CenteredLayout from '../layouts/CenteredLayout';
import { useUsername } from '../../store/username';
import BabylonImage from '../components/BabylonImage';

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-mono">{`Welcome back ${username}!`}</p>
          <p className="text-5xl font-mono">Ready to play?</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-16">
          <MainButton onClick={() => handleClick("online")}>
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 relative flex justify-center items-center hover:border border-accent">
                <BabylonImage type={"online"} />
              </div>
              <p className="text-xs font-mono">play online</p>
            </div>
          </MainButton>
          <MainButton onClick={() => handleClick("ai")}>
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 relative flex justify-center items-center hover:border border-accent">
                <BabylonImage type={"ai"} />
              </div>
              <p className="text-xs font-mono">play vs AI</p>
            </div>
          </MainButton>
          <MainButton onClick={() => handleClick("local")}>
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 relative flex justify-center items-center hover:border border-accent">
                <BabylonImage type={"local"} />
              </div>
              <p className="text-xs font-mono">play locally</p>
            </div>
          </MainButton>
        </div>
      </div>
    </CenteredLayout>
  );
};

export default Home;
