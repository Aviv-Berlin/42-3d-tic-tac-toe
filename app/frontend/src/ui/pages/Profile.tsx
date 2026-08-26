import { useState, useEffect } from 'react';
import ProfileLayout from '../layouts/ProfileLayout';
import GameRecap from '../components/GameRecap';
import { GameHistory } from '../../../../shared/game'
import statsService from "../../services/stats";
import { getErrorMessage } from "../../utils/errors";

const Profile = () => {
  
  const [games, setGames] = useState<GameHistory[]>([]);
  const [winTotal, setWinTotal] = useState(0);
  const [drawTotal, setDrawTotal] = useState(0);
  const [lossTotal, setLossTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const fillStats = async () => {
    try {
      const history_response = await statsService.getGameHistory();
      const win_response = await statsService.getWinTotal();
      const draw_response = await statsService.getDrawTotal();
      const loss_response = await statsService.getLossTotal();
      setGames(history_response.data);
      setWinTotal(win_response.data);
      setDrawTotal(draw_response.data);
      setLossTotal(loss_response.data);
      console.log("Retrieved stats");
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    } 
  };

  useEffect(() => {
    fillStats(); 
  }, []);

  return (
    <ProfileLayout>
      <div className="border-r p-8 flex flex-col gap-4">
        <h2 className="text-3xl font-serif italic">Recent Games</h2>
        {games.map((game, i) => (
          <GameRecap key={i} gameHistory={game} />
        ))}
      </div>
      <div className="flex flex-col p-8 gap-4">
        <h2 className="text-3xl font-serif italic">Stats</h2>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Rank:</p>
          <p className="text-2xl font-serif italic">Under construction</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Games:</p>
          <p className="text-2xl font-serif italic">Under construction</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Wins:</p>
          <p className="text-2xl font-serif italic">{winTotal}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Draws:</p>
          <p className="text-2xl font-serif italic">{drawTotal}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Losses:</p>
          <p className="text-2xl font-serif italic">{lossTotal}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Win ratio:</p>
          <p className="text-2xl font-serif italic">Under construction</p>
        </div>

      </div>
    </ProfileLayout>
  )
}

export default Profile