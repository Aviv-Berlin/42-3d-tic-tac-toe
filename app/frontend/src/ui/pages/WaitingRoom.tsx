import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CenteredLayout from "../layouts/CenteredLayout"
import MainButton from "../components/MainButton";
import SecondaryButton from "../components/SecondaryButton";

const WaitingRoom = () => {
  const [numPlayers, setNumPlayers] = useState(1);

  const navigate = useNavigate();

  const handlePlay = () => {
    console.log("play")
  }

  const handleCancel = () => {
    console.log("remove the game")
    navigate('/lobby')
  }

  return (
    <CenteredLayout>
      <h1 className="text-5xl font-serif italic">WAITING ROOM</h1>
      <p>{numPlayers}/2 players joined</p>
      {numPlayers === 2 && <MainButton onClick={handlePlay}>PLAY</MainButton>}
      {numPlayers !== 2 && <MainButton disabled={true}>PLAY</MainButton>}
      <SecondaryButton onClick={handleCancel}>Cancel Game</SecondaryButton>
    </CenteredLayout>
  )
}

export default WaitingRoom
