import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import GameLayout from '../layouts/GameLayout';
import Canvas from '../components/Canvas';
import { sendMessage } from "../../services/websocket";
import { useGameData } from "../../store/gameData"
import { createStartGameMessage } from '../../../../shared/messages';
import { getSocket } from "../../services/websocket";
import { WsMessage } from "../../../../shared/messages";

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ws = getSocket();

  if (!ws)
	return null;


  const gameData = useGameData();
  const gameModeParam = searchParams.get('game-mode');

	 useEffect(() => {

		const handleMessage = (event: MessageEvent) => {
			const data: WsMessage = JSON.parse(event.data);
			if (data.type === "error") {
			  console.error("[WS/error] WebSocket error: ", data.payload.message);
			  navigate('/not-found');
			}
		}
		ws.addEventListener("message", handleMessage)
        if (!gameData) return;
        console.log("[GAME] Send startGameMessage, Game:", gameData);
        sendMessage(createStartGameMessage(gameData));
    }, [gameData, navigate]);


  const sizeParam = searchParams.get('size');
  const levelParam = searchParams.get('level');

  const isValid =  (
                  (gameModeParam === "online" || gameModeParam === "ai" || gameModeParam === "local") &&
                  (sizeParam === "3" || sizeParam === "4" || sizeParam === "5") &&
                  (levelParam === "0" || levelParam === "1" || levelParam === "2" || levelParam === "3")
				);

  if (!isValid) {
    console.log("invalid search parameters");
  }


  useEffect(() => {
    if (!isValid) navigate('/not-found');
  }, [isValid]);

  if (!isValid || !gameData) return null;

  return (
    <GameLayout>
      <Canvas gameData={gameData}/>
    </GameLayout>
  )
}

export default Game
