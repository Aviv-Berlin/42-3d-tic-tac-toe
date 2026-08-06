import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { PropsWithChildren } from 'react'

const ProfileLayout = ({children}: PropsWithChildren) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-grid grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default ProfileLayout
