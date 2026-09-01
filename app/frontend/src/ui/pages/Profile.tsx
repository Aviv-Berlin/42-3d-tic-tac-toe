import { useState, useEffect } from 'react';
import ProfileLayout from '../layouts/ProfileLayout';
import GameRecap from '../components/GameRecap';
import { GameHistory } from '../../../../shared/game'
import statsService from "../../services/stats";

const Profile = () => {
  const [games, setGames] = useState<GameHistory[]>([]);
  const [winTotal, setWinTotal] = useState(0);
  const [drawTotal, setDrawTotal] = useState(0);
  const [lossTotal, setLossTotal] = useState(0);

  const gamesTotal = winTotal + drawTotal + lossTotal;
  const winRatio = gamesTotal ? (winTotal / gamesTotal * 100).toFixed(2) : Number(0).toFixed(2);

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
      console.log(err);
    }
  };

  useEffect(() => {
    fillStats();
  }, []);

  return (
    <ProfileLayout>
      <div className="border-r p-8 flex flex-col gap-4">
        <h2 className="text-2xl mb-4">Recent Games <span className="text-sm">(LAST 5 GAMES PLAYED)</span></h2>
        {games.map((game, i) => (
          <GameRecap key={i} gameHistory={game} />
        ))}
        {!games.length && <p className="italic">You haven&apos;t played any game yet!</p>}
      </div>
      <div className="flex flex-col p-8 gap-4">
        <h2 className="text-2xl mb-4">Stats</h2>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">RANK:</p>
          <p className="text-xl">-</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">GAMES:</p>
          <p className="text-xl">{gamesTotal}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">WINS:</p>
          <p className="text-xl">{winTotal}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">DRAWS:</p>
          <p className="text-xl">{drawTotal}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">LOSSES:</p>
          <p className="text-xl">{lossTotal}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">WIN RATIO:</p>
          <p className="text-xl">{winRatio}%</p>
        </div>
      </div>
    </ProfileLayout>
  )
}

export default Profile
