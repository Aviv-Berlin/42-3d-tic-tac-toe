import axios from 'axios'

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
  const url = "/v1/auth/register";
  return axios.post(url, user);
}

const login = (form: LoginForm) => {
  const url = "/v1/auth/login";
  return axios.post(url, form);
}

const logout = () => {
  console.log("auth.ts: logout()");
  const url = "/v1/auth/logout";
  return axios.post(url, {});
}

export default { register, login, logout }
