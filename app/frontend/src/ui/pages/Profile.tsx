import ProfileLayout from '../layouts/ProfileLayout';
import { GameData } from '../../types/game'

const Profile = () => {

  // this array will need to be fetched from the backend
  // im using the same interface that gets passed to babylon
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
    }
  ];

  return (
    <ProfileLayout>
      <div className="border-r border-stone-400 p-8 flex flex-col gap-4">
        <h2 className="text-2xl font-serif italic">Recent Games</h2>
        {games.map((game, i) => (
          <div key={i} className="border rounded-md border-stone-400 p-4 flex gap-4">
            <p>WIN</p>
            <p>against AI</p>
            <p>Board size: 3x3x3</p>
          </div>
        ))}
      </div>
      <div className="p-8">
        <h2 className="text-2xl font-serif italic">Stats</h2>
      </div>
    </ProfileLayout>
  )
}

export default Profile
