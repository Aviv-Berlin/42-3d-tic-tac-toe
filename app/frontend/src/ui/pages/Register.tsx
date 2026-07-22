import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import AuthCard from '../components/AuthCard'
import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton'
import auth from '../../services/auth'

const Register = () => {
  const [form, setForm] = useState({username: '', email: '', password: '', confirmPassword: ''});
  const [submit, setSubmit] = useState(false);

  const validate = () => {
    return (
      form.email.includes('@') &&
      form.password.length >= 8 &&
      form.password === form.confirmPassword
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
    setSubmit(false);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    if (!validate()) {
      console.log("invalid form");
      return;
    }
    auth
      .register(form)
      .then(() => console.log("success"))
      .catch(() => console.log("failure"))
  }

  return (
    <AuthLayout>
      <img src="/logo.png" className="hidden md:block w-60 h-auto"/>
      <AuthCard>
        <h1 className="text-xl">Sign up</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <Input name="username" value={form.username} handler={handleChange} submit={submit}/>
          <Input name="email" value={form.email} handler={handleChange}
            validate={() => form.email.includes('@')} message="Invalid email" submit={submit} />
          <Input name="password" value={form.password} handler={handleChange}
            validate={() => form.password.length >= 8} message="Passwords must be at least 8 characters long" submit={submit}/>
          <Input name="confirmPassword" value={form.confirmPassword} handler={handleChange}
            validate={() => form.password === form.confirmPassword} message="Passwords don't match" submit={submit}/>
          <SubmitButton>Sign up</SubmitButton>
        </form>
      <p className="">Already registered? <Link className="hover:underline underline-offset-4" to="/login">Log in</Link></p>
      </AuthCard>
    </AuthLayout>
  )
}

export default Register
