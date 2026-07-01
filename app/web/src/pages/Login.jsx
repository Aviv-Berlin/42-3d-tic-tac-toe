import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../components/Input'
import auth from '../services/auth'

const Login = () => {
  const [form, setForm] = useState({username: '', password: ''});
  const [submit, setSubmit] = useState(false);

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
  }

  return (
    <div className="page">
      <h1>Log in</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <Input name="username" value={form.username} handler={handleChange} submit={submit}/>
        <Input name="password" value={form.password} handler={handleChange} submit={submit}/>
        <button className="submit-button" type="submit">Log in</button>
      </form>
      <p>Don't have an account? <Link to="/register">Sign up</Link></p>
    </div>
  )
}

export default Login
