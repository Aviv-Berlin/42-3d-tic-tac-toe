import axios from 'axios';

const getUsername = () => {
  const url = "/v1/me";
  return axios.get(url);
};

export default { getUsername };
