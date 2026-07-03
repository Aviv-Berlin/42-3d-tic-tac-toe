import { useEffect, useRef } from "react";
import { createBabylonGame } from "/../../babylon_test_home/src/main.ts";

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
      className="w-full h-full"
    />
  );
};

export default Canvas;
