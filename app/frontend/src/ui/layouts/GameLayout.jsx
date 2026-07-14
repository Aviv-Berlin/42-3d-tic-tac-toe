import Navbar from '../components/Navbar'

const GameLayout = ({children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  )
}

export default GameLayout
