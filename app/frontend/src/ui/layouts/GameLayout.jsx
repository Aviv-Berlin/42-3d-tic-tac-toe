import Navbar from '../components/Navbar'

const GameLayout = ({username, children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={username}/>
      <div className="flex-1 flex">
        {children}
      </div>
    </div>
  )
}

export default GameLayout
