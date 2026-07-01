import Navbar from '../components/Navbar'
import Canvas from '../components/Canvas'

const Game = () => {
  const page = "game"
  return (
    <div className="page">
      <Navbar page={page} />
      <Canvas />
    </div>
  )
}

export default Game
