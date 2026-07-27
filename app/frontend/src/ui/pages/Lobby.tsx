import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ActiveGame } from "../../types/game";
import MainButton from "../components/MainButton";
import SecondaryButton from "../components/SecondaryButton";

const Lobby = () => {
  const navigate = useNavigate();

  // this will be replaced with actual active games from the backend once we have an endpoint
  const activeGames: ActiveGame[] = [
    { host: "s-gas", size: 3 },
    { host: "tic-tac-toe-master", size: 4 },
    { host: "s-gas", size: 3 },
    { host: "tic-tac-toe-master", size: 4 },
    { host: "s-gas", size: 3 },
    { host: "tic-tac-toe-master", size: 4 },
  ];
  //const activeGames: ActiveGame[] = [];

  if (activeGames.length === 0) {
    return (
      <MainLayout>
        <div className="flex flex-col gap-12">
          <div className="relative flex w-full justify-center items-center">
            <div className="absolute left-0">
              <SecondaryButton onClick={() => navigate('/home')}>← Back</SecondaryButton>
            </div>
            <h1 className="text-xl">Mode: <span className="font-serif italic">Online</span></h1>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <p className="text-xl font-serif italic">There are currently no active games.</p>
            <MainButton onClick={() => navigate('/game-settings?game-mode=online')}>
              + Create Game
            </MainButton>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-12">
        <div className="relative flex w-full justify-center items-center">
          <div className="absolute left-0">
            <SecondaryButton onClick={() => navigate('/home')}>← Back</SecondaryButton>
          </div>
          <h1 className="text-xl">Mode: <span className="font-serif italic">Online</span></h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-serif italic">Games Lobby</h2>
            <SecondaryButton onClick={() => navigate('/game-settings?game-mode=online')}>
              + Create Game
            </SecondaryButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeGames.map((game, index) => (
              <div key={index} className="flex flex-col gap-2 border rounded-md border-stone-400 p-4">
                <h3 className="text-2xl font-serif italic">{game.host}'s game</h3>
                <span>Host: {game.host}</span>
                <span>Size: {game.size}x{game.size}x{game.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Lobby;
