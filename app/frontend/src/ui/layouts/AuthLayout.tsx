import Footer from '../components/Footer'
import { PropsWithChildren } from 'react'

const AuthLayout = ({children}: PropsWithChildren) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex justify-center items-center gap-8 p-4">{children}</main>
      <Footer />
    </div>
  )
}

export default AuthLayout
