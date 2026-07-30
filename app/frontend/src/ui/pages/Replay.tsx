import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameLayout from "../layouts/GameLayout";
import { replyGame } from "../../game/Reply";
import { useGameData } from "../../store/gameData";

const Replay = () => {
  const navigate = useNavigate();

  const gameData = useGameData();

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
