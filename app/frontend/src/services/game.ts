import axios from "axios";

const joinMatch = (matchId: string, username: string) => {
  const url = "/v1/game/lobby/join";
  return axios.post(url, { matchId, player: username });
};

export default { joinMatch };
