import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MainLayout = ({username, children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={username}/>
      <main className="flex-1 flex flex-col justify-center items-center p-4">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
