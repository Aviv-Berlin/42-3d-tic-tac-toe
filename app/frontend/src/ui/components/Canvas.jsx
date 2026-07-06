import { useEffect, useRef } from "react";
import { createBabylonGame } from "../../game/main.ts";

const Canvas = ({username,size}) => {
  const canvasRef = useRef(null); // why?

  useEffect(() => {
    if (!canvasRef.current) return;

    const cleanup = createBabylonGame(canvasRef.current, size, username); 
    //passing also "username" as parameter, so we can display their name instead of just "player 1" or "player 2"

    return cleanup;
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      id="renderCanvas"
      className="flex-1"
    />
  );
};

export default Canvas;
