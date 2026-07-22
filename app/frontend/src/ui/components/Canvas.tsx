import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createBabylonGame } from "../../game/main";
import { GameState } from "../../types/game";

interface CanvasProps {
  gameState: GameState;
}

const Canvas = ({gameState}: CanvasProps) => {
  const canvasRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current) return;

    //here we need to pass the entire gameState, which means that we need to change the signature of createBabylonGame
    // NEW SIGNATURE -> function createBabylonGame(canvas: HTMLCanvasElement, gameState: GameState, onExit: () => void)
    const cleanup = createBabylonGame(canvasRef.current, gameState.size, "test", () => navigate('/home')); 

    return cleanup;
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
