import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameLayout from "../layouts/GameLayout";
import { useGameData } from "../context/GameDataContext";
import { replyGame } from "../../game/Reply";


const Replay = () => {
  const navigate = useNavigate();

  const gameDataContext = useGameData();
  const gameData = gameDataContext?.gameData;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {

    if (!canvasRef.current || !gameData) return;

    return replyGame(canvasRef.current, gameData, () => {
      navigate('/game-end');
    });
  }, []);
  return (
    <GameLayout>
      <canvas ref={canvasRef} className="flex-1" />
    </GameLayout>
  );
};

export default Replay;
