import axios from 'axios'
import { useSetUsername } from '../store/username';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginForm {
  login: string;
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
 // const setUsername = useSetUsername();
  const url = "/v1/auth/logout";
 /* 
  try {
	console.log("Trying setUsername") 
  	setUsername('nothing');
  } catch (err) {
      console.log(err);
  }
	  */
  return axios.post(url, {});
}

export default { register, login, logout }
