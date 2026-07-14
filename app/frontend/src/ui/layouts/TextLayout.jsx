import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TextLayout = ({children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col gap-4 py-10 w-2/3 lg:w-1/2 mx-auto">{children}</main>
      <Footer />
    </div>
  )
}

export default TextLayout
