import Navbar from '../components/Navbar'
import { PropsWithChildren } from 'react'

const GameLayout = ({children}: PropsWithChildren) => {
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
