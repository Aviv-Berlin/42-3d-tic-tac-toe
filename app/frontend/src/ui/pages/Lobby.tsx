import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { ActiveGame } from "../../types/game";
import MainButton from "../components/MainButton";

const Lobby = () => {
  const navigate = useNavigate();

  const activeGames: ActiveGame[] = [
    { host: "s-gas", size: 3 },
    { host: "tic-tac-toe-master", size: 4 },
  ];
  //const activeGames: ActiveGame[] = [];

  if (activeGames.length === 0) {
    return (
      <MainLayout>
        <div className="flex flex-col gap-12">
          <div className="relative flex w-full justify-center items-center">
            <button
              className="absolute left-0 border rounded-md border-stone-400 px-2 py-1 hover:bg-stone-200 cursor-pointer"
              onClick={() => navigate('/home')}
            >← Back</button>
            <h1 className="text-xl">Mode: <span className="font-serif italic">Online</span></h1>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <p className="text-xl font-serif italic">There are currently no active games.</p>
            <MainButton onClick={() => navigate('/game-settings?game-mode=online')}>
              Create Game
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
          <button
            className="absolute left-0 border rounded-md border-stone-400 px-2 py-1 hover:bg-stone-200 cursor-pointer"
            onClick={() => navigate('/home')}
          >← Back</button>
          <h1 className="text-xl">Mode: <span className="font-serif italic">Online</span></h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-serif italic">Active Games</h2>
            <MainButton onClick={() => navigate('/game-settings?game-mode=online')}>
              Create Game
            </MainButton>
          </div>
          {activeGames.map((game, index) => (
            <div key={index} className="flex flex-col border rounded-md border-stone-400 p-4">
              <span>Host: {game.host}</span>
              <span>Size: {game.size}x{game.size}x{game.size}</span>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Lobby;
