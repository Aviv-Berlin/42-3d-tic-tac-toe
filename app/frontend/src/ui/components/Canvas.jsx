import { useEffect, useRef } from "react";
import { useUsername } from '../context/UsernameContext'
import { createBabylonGame } from "../../game/main.ts";
import { useNavigate } from "react-router-dom";


const Canvas = ({size}) => {
  const canvasRef = useRef(null);
  const { username } = useUsername();

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
