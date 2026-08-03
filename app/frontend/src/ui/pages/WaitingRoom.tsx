import { useState } from "react"
import CenteredLayout from "../layouts/CenteredLayout"
import MainButton from "../components/MainButton";

const WaitingRoom = () => {
  const [numPlayers, setNumPlayers] = useState(1);

  const handlePlay = () => {
    console.log("play")
  }

  return (
    <CenteredLayout>
      <h1 className="text-5xl font-serif italic">WAITING ROOM</h1>
      <p>{numPlayers}/2 players joined</p>
      <MainButton onClick={handlePlay}>PLAY</MainButton>
    </CenteredLayout>
  )
}

export default WaitingRoom
