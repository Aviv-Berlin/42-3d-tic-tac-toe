import axios from "axios";

const baseUrl = "/v1/game";

const joinMatch = (matchId: string, username: string) => {
  const url = `${baseUrl}/lobby/join`;
  return axios.post(url, { matchId });
};

const createLobby = (username: string, size: number) => {
  const url = `${baseUrl}/lobby/create`;
  return axios.post(url, { size, requiredPlayers: 2 });
};

const createEventSource = () => {
  return new EventSource(`${baseUrl}/lobby`);
};

export default { joinMatch, createLobby, createEventSource };
