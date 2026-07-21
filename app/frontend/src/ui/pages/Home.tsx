import { useNavigate } from 'react-router-dom';
import { useUsername } from '../context/UsernameContext'
import MainLayout from '../layouts/MainLayout';
import MainButton from '../components/MainButton';

const Home = () => {
  const navigate = useNavigate();

  const userInfo = useUsername();
  if (!userInfo) return null;
  
  const { username } = userInfo;

  const handleClick = () => {
    navigate("/game-settings");
  };

  return (
    <MainLayout>
      <div className="flex gap-16 items-center">
        <div className="flex flex-col gap-2">
          <p className="text-lg">{`Welcome back ${username}!`}</p>
          <p className="text-4xl font-serif italic">Ready for a game?</p>
        </div>
        <div className="flex gap-4">
          <MainButton onClick={handleClick}>PLAY ONLINE</MainButton>
          <MainButton onClick={handleClick}>PLAY VS AI</MainButton>
          <MainButton onClick={handleClick}>PLAY LOCALLY</MainButton>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
