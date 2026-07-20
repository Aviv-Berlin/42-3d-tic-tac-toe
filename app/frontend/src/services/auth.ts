import axios from 'axios'

const baseUrl = "http://localhost:3001";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginForm {
  username: string;
  password: string;
}

const register = (form: RegisterForm) => {
  const user = {
    username: form.username,
    email: form.email,
    password: form.password,
  }
  const url = `${baseUrl}/v1/auth/register`;
  return axios.post(url, user);
}

const login = (form: LoginForm) => {
  const url = `${baseUrl}/v1/auth/login`;
  return axios.post(url, form);
}

export default { register, login }
