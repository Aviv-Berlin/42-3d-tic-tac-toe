import axios from "axios";

const baseUrl = "/v1/stats";

const getGameHistory = () => {
  const url = `${baseUrl}/profile/history`;
  return axios.get(url);
};

const getWinTotal = () => {
  const url = `${baseUrl}/profile/wins`;
  return axios.get(url);
};

const getDrawTotal = () => {
  const url = `${baseUrl}/profile/draws`;
  return axios.get(url);
};

const getLossTotal = () => {
  const url = `${baseUrl}/profile/losses`;
  return axios.get(url);
};

export default { getGameHistory, getWinTotal, getDrawTotal, getLossTotal };
