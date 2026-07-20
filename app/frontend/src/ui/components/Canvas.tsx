import { useEffect, useRef } from "react";
import { useUsername } from '../context/UsernameContext'
import { useNavigate } from "react-router-dom";
import { createBabylonGame } from "../../game/main";

interface CanvasProps {
  size: number;
}

const Canvas = ({size}: CanvasProps) => {
  const canvasRef = useRef(null);
  const userInfo = useUsername();
  if (!userInfo) return null;

  const { username } = userInfo;

  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current) return;

    const cleanup = createBabylonGame(canvasRef.current, size, username, () => navigate('/home')); 

    return cleanup;
  }, [size, username, navigate]); //the effect runs again if one of these values change

  return (
    <canvas
      ref={canvasRef}
      id="renderCanvas"
      className="flex-1"
    />
  );
};

export default Canvas;
