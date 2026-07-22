import { useEffect, useRef } from "react";
import { useUsername } from '../context/UsernameContext'
import { createBabylonGame } from "../../game/main.ts";

const Canvas = ({size}) => {
  const canvasRef = useRef(null);
  const { username } = useUsername();

  useEffect(() => {
    if (!canvasRef.current) return;

    const cleanup = createBabylonGame(canvasRef.current, size, username); 

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
