import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUsername } from '../context/UsernameContext'
import AuthLayout from '../layouts/AuthLayout'
import AuthCard from '../components/AuthCard'
import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton'
import auth from '../../services/auth'

const Login = () => {
  const [form, setForm] = useState({username: '', password: ''});
  const [submit, setSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const userInfo = useUsername();
  if (!userInfo) return null;

  const { setUsername } = userInfo; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
    setSubmit(false);
    setErrorMessage('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    try {
      const response = await auth.login(form)
      const token = response.data.accessToken;
      window.localStorage.setItem('token', token);
      setUsername(form.username);
      navigate("/home");
    } catch(err) {
      console.log(err);
      setErrorMessage("Invalid credentials");
    }
  }

  return (
    <AuthLayout>
      <img src="/logo.png" className="hidden md:block w-60 h-auto"/>
      <AuthCard>
        <h1 className="text-2xl font-serif italic">Log in</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <Input name="username" value={form.username} handler={handleChange} submit={submit}/>
          <Input name="password" value={form.password} handler={handleChange} submit={submit}/>
          <SubmitButton>Log in</SubmitButton>
        </form>
        <p className="">Don't have an account? <Link className="hover:underline underline-offset-4" to="/register">Sign up</Link></p>
        <p className="text-red-400 min-h-[24px]">{errorMessage}</p>
      </AuthCard>
    </AuthLayout>
  )
}

export default Login
