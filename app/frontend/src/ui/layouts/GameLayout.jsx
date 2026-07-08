import Navbar from '../components/Navbar'

const GameLayout = ({username, children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={username}/>
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  )
}

export default GameLayout
