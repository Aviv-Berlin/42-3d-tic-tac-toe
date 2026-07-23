import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createBabylonGame } from "../../game/main";
import { GameData } from "../../types/game";

interface CanvasProps {
  gameData: GameData | undefined;
}

const Canvas = ({gameData}: CanvasProps) => {
  const canvasRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current || !gameData) return;

    //here we need to pass the entire gameState, which means that we need to change the signature of createBabylonGame
    // NEW SIGNATURE -> function createBabylonGame(canvas: HTMLCanvasElement, gameState: GameState, onExit: () => void)
    const cleanup = createBabylonGame(canvasRef.current, gameData, () => navigate('/home')); 

    return cleanup;
  }, [gameData, navigate]);

  if (!gameData)
        return <p>Game data is missing.</p>;
  return (
    <canvas
      ref={canvasRef}
      id="renderCanvas"
      className="flex-1"
    />
  );
};

export default Canvas;
