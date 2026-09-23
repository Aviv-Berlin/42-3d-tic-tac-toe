import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createBabylonGame } from "../../game/main";
import { GameData } from "../../../../shared/game";
import { useSetGameData } from "../../store/gameData"
import { waitForSocket } from "../../services/websocket";

interface CanvasProps {
  gameData: GameData | undefined;
}

const Canvas = ({gameData}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const navigate = useNavigate();

  const setGameData = useSetGameData();

  useEffect(() => {
	if (!canvasRef.current || !gameData) return;

	let cleanup: (() => void) | undefined;

	createBabylonGame(canvasRef.current, gameData, () => {
		navigate('/game-end');
	}).then((result) => {
		cleanup = result;
	});

	return () => {
		cleanup?.();
	};
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


