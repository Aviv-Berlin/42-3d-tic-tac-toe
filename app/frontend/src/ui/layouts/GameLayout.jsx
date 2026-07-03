import Navbar from '../components/Navbar'

const GameLayout = ({children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {children}
      </div>
    </div>
  )
}

export default GameLayout
