import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import AuthCard from '../components/AuthCard'
import Input from '../components/Input'
import SubmitButton from '../components/SubmitButton'
import auth from '../../services/auth'
import { validateForm } from '../../utils/auth'
import BabylonImage from '../components/BabylonImage';
import { getErrorMessage } from '../../utils/errors';

const Register = () => {
  const [form, setForm] = useState({username: '', email: '', password: '', confirmPassword: ''});
  const [submit, setSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
    setSubmit(false);
    setErrorMessage('');
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    if (!validateForm(form)) {
      console.log("invalid form");
      return;
    }
    try {
      await auth.register(form)
      navigate('/register-success');
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    }
  }

  return (
    <AuthLayout>
      <div className="hidden md:block w-100 h-100 relative">
        <BabylonImage type="logo" />
      </div>
      <AuthCard>
        <h1 className="text-3xl">Sign up</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <Input name="username" value={form.username} handler={handleChange} submit={submit}
            validate={() => form.username.length <= 16} message="Username is too long"/>
          <Input name="email" value={form.email} handler={handleChange}
            validate={() => form.email.includes('@')} message="Invalid email" submit={submit} />
          <Input name="password" value={form.password} handler={handleChange}
            validate={() => form.password.length >= 8} message="Passwords must be at least 8 characters long" submit={submit}/>
          <Input name="confirmPassword" value={form.confirmPassword} handler={handleChange}
            validate={() => form.password === form.confirmPassword} message="Passwords don't match" submit={submit}/>
          <SubmitButton>Sign up</SubmitButton>
        </form>
      <p>Already registered? <Link className="hover:text-dark-orange" to="/login">Log in</Link></p>
      <p className="text-dark-orange min-h-6">{errorMessage}</p>
      </AuthCard>
    </AuthLayout>
  )
}

export default Register
