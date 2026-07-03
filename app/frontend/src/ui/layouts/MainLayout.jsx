import Navbar from '../components/Navbar'

const MainLayout = ({username, children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={username}/>
      {children}
    </div>
  )
}

export default MainLayout
