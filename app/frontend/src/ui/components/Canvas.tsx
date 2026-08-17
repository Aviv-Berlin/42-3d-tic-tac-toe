import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createBabylonGame } from "../../game/main";
import { GameData } from "../../../../shared/game";
import { useSetGameData } from "../../store/gameData"

interface CanvasProps {
  gameData: GameData | undefined;
}

const Canvas = ({gameData}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const navigate = useNavigate();

  const setGameData = useSetGameData();

  useEffect(() => {
    if (!canvasRef.current || !gameData) return;

    return createBabylonGame(canvasRef.current, gameData, () => {
      setGameData(gameData);
      navigate('/game-end');
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="renderCanvas"
      className="w-full h-full block"
    />
  );
};

export default Canvas;


