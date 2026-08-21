import { query } from "./db.ts";



export async function getUserGames(id: number) {
	const result = await query(
		'SELECT * FROM matches WHERE player1 = $1 OR player2 = $1 ORDER BY started_at DESC;', [id]
	);

	return result;
}

// export async function getUserWins(id: number) {
// 	const result = await query(
// 		'SELECT * FROM matches WHERE player1 = $1 OR player2 = $1 ORDER BY started_at DESC;', [id]
// 	);

// 	return result;
// }

export async function getMatchReplay(id: number) {
	const result = await query(
		'SELECT * FROM moves WHERE match_id = $1 ORDER BY move_nr;', [id]
	);

	return result;
}

export default {
	getUserGames,
	getUserWins,
	getMatchReplay
};
