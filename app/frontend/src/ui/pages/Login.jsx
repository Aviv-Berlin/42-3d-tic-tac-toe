import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import AuthCard from '../components/AuthCard'
import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton'
import auth from '../../services/auth'

const Login = () => {
  const [form, setForm] = useState({username: '', password: ''});
  const [submit, setSubmit] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
    setSubmit(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmit(true);
    auth
      .login(form)
      .then(() => console.log("success"))
      .catch(() => console.log("failure"))
    navigate(`/home?user=${form.username}`);
  }

  return (
    <AuthLayout>
      <img src="/logo.png" className="w-60 h-auto"/>
      <AuthCard>
        <h1 className="text-xl">Log in</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <Input name="username" value={form.username} handler={handleChange} submit={submit}/>
          <Input name="password" value={form.password} handler={handleChange} submit={submit}/>
          <SubmitButton>Log in</SubmitButton>
        </form>
        <p className="">Don't have an account? <Link to="/register">Sign up</Link></p>
      </AuthCard>
    </AuthLayout>
  )
}

export default Login
