import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'

const RegisterSuccess = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl">Registration Successful</h1>
        <p>Your account has been created.</p>
        <Link className="border border-dark-grey hover:border-dark-orange hover:text-dark-orange px-4 py-2 cursor-pointer" to="/login">Log in</Link>
      </div>
    </AuthLayout>
  )
}

export default RegisterSuccess
