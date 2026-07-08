import Footer from '../components/Footer'

const AuthLayout = ({children}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex justify-center items-center gap-8">{children}</main>
      <Footer />
    </div>
  )
}

export default AuthLayout
