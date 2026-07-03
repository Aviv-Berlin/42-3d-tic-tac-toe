import { useEffect, useRef } from "react";
import { createBabylonGame } from "../../game/main.ts";

const Canvas = ({ size }) => {
  const canvasRef = useRef(null); // why?

  useEffect(() => {
    if (!canvasRef.current) return;

    const cleanup = createBabylonGame(canvasRef.current, size);

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
