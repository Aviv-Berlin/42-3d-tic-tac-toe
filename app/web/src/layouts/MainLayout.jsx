import Navbar from '../components/Navbar'

const MainLayout = ({page, children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar page={page}/>
      <div className="flex-1 flex">
        {children}
      </div>
    </div>
  )
}

export default MainLayout
