import ProfileLayout from '../layouts/ProfileLayout';
import GameRecap from '../components/GameRecap';
import { GameData } from '../../../../shared/game'

const Profile = () => {

  // this array will need to be fetched from the backend
  // im using the same interface that gets passed to babylon
  // send only the last 5 games
  const games: GameData[] = [
    {
      player1: {
        type: "real",
        username: "s-gas",
      },
      player2: {
        type: "real",
        username: "a_random_player",
      },
      level: 0,
      winner: {
        type: "real",
        username: "s-gas",
      },
      moves: [],
      size: 3,
      isFinished: true,
      isDraw: false,
      gameStart: 0,
      gameEnd: 0,
      gameID: "",
      gameMode: "online",
	  endMessage: null
    },
    {
      player1: {
        type: "real",
        username: "s-gas",
      },
      player2: {
        type: "real",
        username: "a_random_player",
      },
      level: 0,
      winner: {
        type: "real",
        username: "a_random_player",
      },
      moves: [],
      size: 3,
      isFinished: true,
      isDraw: false,
      gameStart: 0,
      gameEnd: 0,
      gameID: "",
      gameMode: "online",
	  endMessage: null
    },
    {
      player1: {
        type: "real",
        username: "s-gas",
      },
      player2: {
        type: "ai",
        username: "ai",
      },
      level: 0,
      winner: {
        type: "real",
        username: "s-gas",
      },
      moves: [],
      size: 4,
      isFinished: true,
      isDraw: false,
      gameStart: 0,
      gameEnd: 0,
      gameID: "",
      gameMode: "online",
	  endMessage: null
    }
  ];

  return (
    <ProfileLayout>
      <div className="border-r p-8 flex flex-col gap-4">
        <h2 className="text-3xl font-serif italic">Recent Games</h2>
        {games.map((game, i) => (
          <GameRecap key={i} gameData={game} />
        ))}
      </div>
      <div className="flex flex-col p-8 gap-4">
        <h2 className="text-3xl font-serif italic">Stats</h2>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Rank:</p>
          <p className="text-2xl font-serif italic">1234</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Games:</p>
          <p className="text-2xl font-serif italic">42</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Wins:</p>
          <p className="text-2xl font-serif italic">30</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Draws:</p>
          <p className="text-2xl font-serif italic">3</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Losses:</p>
          <p className="text-2xl font-serif italic">9</p>
        </div>
        <div className="flex gap-2 items-baseline justify-between">
          <p className="text-xl">Win ratio:</p>
          <p className="text-2xl font-serif italic">68%</p>
        </div>

      </div>
    </ProfileLayout>
  )
}

export default Profile
