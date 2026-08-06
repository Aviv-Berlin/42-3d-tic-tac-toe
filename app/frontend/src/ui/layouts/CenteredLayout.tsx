import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { PropsWithChildren } from 'react'

const CenteredLayout = ({children}: PropsWithChildren) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col justify-center items-center p-8 bg-grid gap-8">
          {children}
      </main>
      <Footer />
    </div>
  )
}

export default CenteredLayout
