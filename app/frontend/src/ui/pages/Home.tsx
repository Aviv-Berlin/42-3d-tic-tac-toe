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
        <div className="flex flex-col">
          <p className="text-xl">{`Welcome back ${username}!`}</p>
          <p className="text-4xl">Ready for a game?</p>
        </div>
        <div className="flex flex-col gap-4">
          <MainButton onClick={handleClick}>PLAY ONLINE</MainButton>
          <MainButton onClick={handleClick}>PLAY AGAINST AI</MainButton>
          <MainButton onClick={handleClick}>PLAY LOCALLY WITH A FRIEND</MainButton>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
