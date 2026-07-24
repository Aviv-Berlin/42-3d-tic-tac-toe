import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'

const RegisterSuccess = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-5xl font-serif italic">Registration Successful</h1>
        <p>Your account has been created.</p>
        <Link className="border rounded-md border-stone-400 px-4 py-2 hover:bg-stone-200 cursor-pointer" to="/login">Log in</Link>
      </div>
    </AuthLayout>
  )
}

export default RegisterSuccess
