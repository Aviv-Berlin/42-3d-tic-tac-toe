import axios from 'axios'

const baseUrl = "http://localhost:3000";

const register = (form) => {
  const user = {
    username: form.username,
    email: form.email,
    password: form.password,
  }
  const url = `${baseUrl}/v1/auth/register`;
  return axios.post(url, user);
}

const login = (form) => {
  const url = `${baseUrl}/v1/auth/login`;
  return axios.post(url, form);
}

export default { register, login }
