import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createBabylonGame } from "../../game/main";
import { GameData } from "../../types/game";
import { useGameData } from "../context/GameDataContext";

interface CanvasProps {
  gameData: GameData | undefined;
}

const Canvas = ({gameData}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const navigate = useNavigate();

  const gameDataContext = useGameData();

  useEffect(() => {
    if (!canvasRef.current || !gameData) return;

    return createBabylonGame(canvasRef.current, gameData, () => {
      window.localStorage.setItem("gameData", JSON.stringify(gameData))
      gameDataContext?.setGameData(gameData);
      navigate('/game-end');
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="renderCanvas"
      className="flex-1"
    />
  );
};

export default Canvas;
