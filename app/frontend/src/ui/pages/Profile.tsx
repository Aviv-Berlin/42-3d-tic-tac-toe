import { useState, useEffect } from 'react';
import ProfileLayout from '../layouts/ProfileLayout';
import GameRecap from '../components/GameRecap';
import { GameHistory } from '../../../../shared/game'
import statsService from "../../services/stats";
import { UserGameStats, RankData } from "../../../../shared/form";

const Profile = () => {
  const [games, setGames] = useState<GameHistory[]>([]);
  const [rankData, setRankData] = useState({id: 0, full_rank: 0, full_score: 0, online_rank: 0,
    online_score: 0, total_users: 0} as RankData);
  const [stats, setStats] = useState({online: {wins: 0, draws: 0, losses: 0,},
                                      all: {wins: 0, draws: 0, losses: 0,}} as UserGameStats);

  const gamesTotal = stats.all.wins + stats.all.draws + stats.all.losses;
  const winRatio = gamesTotal ? (stats.all.wins / gamesTotal * 100).toFixed(2) : Number(0).toFixed(2);

  const fillStats = async () => {
    try {
      const historyResponse = await statsService.getGameHistory();
      const rankResponse = await statsService.getRankData();
      const statsResponse = await statsService.getStats();
      setGames(historyResponse.data);
      setRankData(rankResponse.data);
      setStats(statsResponse.data);
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
        <h2 className="text-2xl mb-4">Stats <span className="text-sm">(FOR ALL GAMES)</span></h2>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">SCORE:</p>
          <p className="text-xl">{rankData.full_score}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">RANK:</p>
          <p className="text-xl">{rankData.full_rank}/{rankData.total_users}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">GAMES:</p>
          <p className="text-xl">{gamesTotal}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">WINS:</p>
          <p className="text-xl">{stats.all.wins}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">DRAWS:</p>
          <p className="text-xl">{stats.all.draws}</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-md">LOSSES:</p>
          <p className="text-xl">{stats.all.losses}</p>
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
