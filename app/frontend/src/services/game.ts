import axios from "axios";
import { GameMode } from "../../../shared/game";

const baseUrl = "/v1/game";

const joinMatch = (matchId: string) => {
  const url = `${baseUrl}/lobby/join`;
  return axios.post(url, { matchId });
};

const createOnline = (size: number) => {
  const url = `${baseUrl}/lobby/create`;
  return axios.post(url, { size, requiredPlayers: 2 });
};

const createLocal = (gameMode: GameMode, level: number, size: number) => {
  const url = `${baseUrl}/local/create`;
  return axios.post(url, { gameMode, level, size, requiredPlayers: 2 });
};

const createEventSource = () => {
  return new EventSource(`${baseUrl}/lobby`);
};

export default { joinMatch, createOnline, createLocal, createEventSource };
