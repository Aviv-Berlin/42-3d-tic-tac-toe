import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainButton from '../components/MainButton'
import SecondaryButton from '../components/SecondaryButton'
import MainLayout from '../layouts/MainLayout';
import BoardSizeSettings from '../components/BoardSizeSettings'
import DifficultySettings from '../components/DifficultySettings'
import { normalizeGameMode } from '../../utils/gameMode';

const GameSettings = () => {
  const [size, setSize] = useState(3);
  const [level, setLevel] = useState(0);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const gameMode = searchParams.get('game-mode');

  const isValid = gameMode === "online" || gameMode === "ai" || gameMode === "local";

  useEffect(() => {
    if (!isValid) navigate('/not-found');
  }, [isValid]);

  if (!isValid) return null;

  const gameModeDisplay = normalizeGameMode(gameMode);

  const handleConfirm = async () => {
	
	if (gameMode === "ai" || gameMode === "local") {
	  navigate(`/game?game-mode=${gameMode}&size=${size}&level=${level}`);
	  return;
	}

	const response = await fetch("http://localhost:3001/v1/game/lobby/create", 
	{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			//"Authorization": `Bearer ${localStorage.getItem("token")
		},
		body: JSON.stringify({ 
			host: localStorage.getItem("username"), 
			size, 
			requiredPlayers: 2
		}),
	})

	const data = await response.json();
	if (!response.ok) {
		console.error(data.error);
		return;
	}
	console.log("Created match:", data.match);
	navigate(`/waiting/${data.match.id}`);
  }

  return (
    <MainLayout>
      <div className="w-full flex flex-col gap-16 items-center">
        <div className="relative flex w-full justify-center items-center">
          <div className="absolute left-0">
            <SecondaryButton onClick={() => navigate('/home')}>← Back</SecondaryButton>
          </div>
          <h1 className="text-xl">Mode: <span className="font-serif italic">{gameModeDisplay}</span></h1>
        </div>
        <BoardSizeSettings size={size} setSize={setSize}/>
        {gameMode === "ai" && <DifficultySettings level={level} setLevel={setLevel}/>}
        <MainButton onClick={handleConfirm}>CONFIRM</MainButton>
      </div>
    </MainLayout>
  )
}

// const GameSettings = () => {
//   const [size, setSize] = useState(3);
//   const [level, setLevel] = useState(0);

//   const navigate = useNavigate();

//   const [searchParams] = useSearchParams();

//   const gameMode = searchParams.get('game-mode');

//   const isValid = gameMode === "online" || gameMode === "ai" || gameMode === "local";

//   useEffect(() => {
//     if (!isValid) navigate('/not-found');
//   }, [isValid]);

//   if (!isValid) return null;

//   const gameModeDisplay = normalizeGameMode(gameMode);

//   return (
//     <MainLayout>
//       <div className="w-full flex flex-col gap-16 items-center">
//         <div className="relative flex w-full justify-center items-center">
//           <div className="absolute left-0">
//             <SecondaryButton onClick={() => navigate('/home')}>← Back</SecondaryButton>
//           </div>
//           <h1 className="text-xl">Mode: <span className="font-serif italic">{gameModeDisplay}</span></h1>
//         </div>
//         <BoardSizeSettings size={size} setSize={setSize}/>
//         {gameMode === "ai" && <DifficultySettings level={level} setLevel={setLevel}/>}
//         <MainButton onClick={() => navigate(`/game?game-mode=${gameMode}&size=${size}&level=${level}`)}>CONFIRM</MainButton>
//       </div>
//     </MainLayout>
//   )
// }

export default GameSettings
