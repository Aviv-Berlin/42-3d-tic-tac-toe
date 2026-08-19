import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainButton from '../components/MainButton'
import SecondaryButton from '../components/SecondaryButton';
import MainLayout from '../layouts/MainLayout';
import BoardSizeSettings from '../components/BoardSizeSettings'
import DifficultySettings from '../components/DifficultySettings'
import { normalizeGameMode } from '../../utils/gameMode';
import { useUsername } from '../../store/username'
import { useSetGameData } from "../../store/gameData";
import { openSocket, sendMessage } from '../../services/websocket';
import { createPlayLocalMessage } from '../../../../shared/messages';
import { Match } from "../../../../backend/src/controllers/gameController"
import { AiLevel } from '../../../../shared/game';

const GameSettings = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [size, setSize] = useState(3);
  const [level, setLevel] = useState(1);
  const username = useUsername();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const gameMode = searchParams.get('game-mode');

  const isValid = gameMode === "online" || gameMode === "ai" || gameMode === "local";


  const setGameData = useSetGameData();


  useEffect(() => {
    if (!isValid) navigate('/not-found');
  }, [isValid]);

  if (!isValid) return null;
  
  const gameModeDisplay = normalizeGameMode(gameMode);


  const handleConfirm = async () => {
	
	if (gameMode === "ai" || gameMode === "local") {

		const matchId = crypto.randomUUID();
		const match: Match =  {
			id: matchId,
			host: username,
			mode: gameMode,
			level: level as AiLevel,
			size: size,
			requiredPlayers: 2,
			players: [username],
			status: "ready",
			state: null
		}
		const socket = openSocket(matchId, username);

		const handleMessage = (event: MessageEvent) => {
			const data = JSON.parse(event.data);
			if (data.type === "game-init"){
				console.log("game-init msg frontend received");
				setGameData(data.gameData)
				socket.removeEventListener("message", handleMessage);
				navigate(`/game/${data.id}?game-mode=${gameMode}&level=${level}&size=${data.size}`);
			}
		}
		
		socket.addEventListener("message", handleMessage);
		socket.addEventListener("open", () => {
			sendMessage(createPlayLocalMessage(match));
		}, { once: true });
 	}


	else {
	const response = await fetch("/v1/game/lobby/create", 
	{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ 
			host: username, 
			size, 
			requiredPlayers: 2
		}),
	})

	const data = await response.json();
	if (!response.ok) {
		console.error(data.error);
		return;
	}
	console.log("Created match:", data.match);
	navigate(`/waiting/${data.match.id}`);
  }
}

  return (
    <MainLayout>
      <div className="w-full flex flex-col gap-16 items-center">
        <div className="relative flex w-full justify-center items-center">
          <div className="absolute left-0">
            <SecondaryButton onClick={() => navigate('/home')}>← Back</SecondaryButton>
          </div>
          <h1 className="text-xl">Mode: <span className="font-serif italic">{gameModeDisplay}</span></h1>
        </div>
        <BoardSizeSettings size={size} setSize={setSize}/>
        {gameMode === "ai" && <DifficultySettings level={level} setLevel={setLevel}/>}
        <MainButton onClick={handleConfirm}>CONFIRM</MainButton>
        <p className="text-red-400 min-h-6">{errorMessage}</p>
      </div>
    </MainLayout>
  )
}

export default GameSettings
