import axios from "axios";
import { getHeaderWithToken } from "../utils/token";

const baseUrl = "/v1/game";

const joinMatch = (matchId: string, username: string) => {
  const url = `${baseUrl}/lobby/join`;
  return axios.post(
    url,
    { matchId, player: username },
    { headers: getHeaderWithToken() }
  );
};

const createLobby = (username: string, size: number) => {
  const url = `${baseUrl}/lobby/create`;
  return axios.post(
    url,
    { host: username, size, requiredPlayers: 2 },
    { headers: getHeaderWithToken() }
  );
};

const createEventSource = () => {
  return new EventSource(`${baseUrl}/lobby`);
};

export default { joinMatch, createLobby, createEventSource };
