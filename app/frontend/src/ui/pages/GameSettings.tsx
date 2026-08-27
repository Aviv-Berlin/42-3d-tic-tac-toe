import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PrimaryButton from '../components/PrimaryButton'
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
import gameService from '../../services/game';
import { getErrorMessage } from '../../utils/errors';

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
      const match: Match = {
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
        if (data.type === "game-init") {
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
    } else {
      try {
        const response = await gameService.createLobby(size);
        console.log("Created match:", response.data.match);
        navigate(`/waiting/${response.data.match.id}`);
      } catch (err) {
        setErrorMessage(getErrorMessage(err));
      }
    }
  }

  return (
    <MainLayout>
      <div className="w-full flex flex-col gap-16 items-center">
        <div className="relative flex w-full justify-center items-center">
          <div className="absolute left-0">
            <SecondaryButton onClick={() => navigate('/home')}>← Back</SecondaryButton>
          </div>
          <h1 className="text-lg">Mode: <span className="underline underline-offset-4">{gameModeDisplay}</span></h1>
        </div>
        <BoardSizeSettings size={size} setSize={setSize}/>
        {gameMode === "ai" && <DifficultySettings level={level} setLevel={setLevel}/>}
        <PrimaryButton onClick={handleConfirm}>
          CONFIRM
        </PrimaryButton>
        <p className="text-dark-orange min-h-6">{errorMessage}</p>
      </div>
    </MainLayout>
  )
}

export default GameSettings
