import axios from "axios";

const baseUrl = "/v1/stats";

const getGameHistory = () => {
  const url = `${baseUrl}/profile/history`;
  return axios.get(url);
};

const getRankData = () => {
  const url = `${baseUrl}/profile/rank`;
  return axios.get(url);
};

const getStats = () => {
  const url = `${baseUrl}/profile/stats`;
  return axios.get(url);
};

export default { getGameHistory, getRankData, getStats };
