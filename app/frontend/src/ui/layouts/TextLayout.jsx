import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TextLayout = ({username, children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={username}/>
      <main className="flex-1 flex flex-col items-center px-10 sm:px-20 md:px-40 lg:px-80 py-10">{children}</main>
      <Footer username={username}/>
    </div>
  )
}

export default TextLayout
