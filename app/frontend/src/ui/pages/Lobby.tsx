import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { ActiveGame } from "../../../../shared/game";
import MainButton from "../components/MainButton";
import SecondaryButton from "../components/SecondaryButton";
import gameService from "../../services/game";
import { getErrorMessage } from "../../utils/errors";

//const token = localStorage.getItem("token");

const Lobby = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [activeGames, setActiveGames] = useState<ActiveGame[]>([]);
  const [joinedMatchId, setJoinedMatchId] = useState('');

  const joinMatch = async (matchId: string) => {
    try {
      const response = await gameService.joinMatch(matchId);
    	console.log("Joined match:", response.data.match);
    	navigate(`/waiting/${response.data.match.id}`);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
      setJoinedMatchId(matchId);
    }
	};

  useEffect(() => {
    const eventSource = gameService.createEventSource();

    eventSource.addEventListener("lobby-update", (event) => {
      const update = JSON.parse(event.data);

      switch (update.type) {
    		case "initial":
   			setActiveGames(update.matches);
   			break;

    		case "created":
   			setActiveGames(prev => [...prev, update.match]);
   			break;

    		case "updated":
   			setActiveGames(prev => prev.map(match => match.id === update.match.id ? update.match : match));
   			break;

    		case "removed":
   			setActiveGames(prev => prev.filter(match => match.id !== update.match.id));
   			break;
      }
    });
  	return () => {
  		eventSource.close();
  	};
  }, []);

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
        <div className="relative flex flex-col sm:flex-row w-full justify-center items-center gap-4">
          <div className="sm:absolute sm:left-0">
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
            {activeGames.map((game) => (
              <div key={game.id} className="flex flex-col">
                <div key={game.id} className="flex justify-between items-end border rounded-md p-4 bg-white">
                  <div key={game.id} className="flex flex-col">
                    <h3 className="text-2xl font-serif italic">{game.host}&apos;s game</h3>
                    <span>Host: {game.host}</span>
                    <span>Size: {game.size}x{game.size}x{game.size}</span>
                  </div>
                  <SecondaryButton onClick={() => joinMatch(game.id)}>
                    Join
                  </SecondaryButton>
                </div>
                {joinedMatchId && joinedMatchId === game.id && <p className="text-red-400 min-h-6">{errorMessage}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};


export default Lobby;
