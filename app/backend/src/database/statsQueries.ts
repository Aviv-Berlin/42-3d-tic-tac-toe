import { query } from "./db.ts";



export async function getUserGames(id: number) {
	const result = await query(
		'SELECT * FROM matches WHERE player1 = $1 OR player2 = $1 ORDER BY started_at DESC;', [id]
	);
	return result;
}

export async function getUserWins(id: number) {
	const result = await query(
		'SELECT COUNT(*) FROM matches WHERE (player1 = $1 OR player2 = $1) AND winner = $1;', [id]
	);
	return result.rows[0];
}

export async function getUserDraws(id: number) {
	const result = await query(
		'SELECT COUNT(*) FROM matches WHERE (player1 = $1 OR player2 = $1) AND winner == null;', [id]
	);
	return result.rows[0];
}

export async function getUserLosses(id: number) {
	const result = await query(
		'SELECT COUNT(*) FROM matches WHERE (player1 = $1 OR player2 = $1) AND winner != null AND winner != $1;', [id]
	);
	return result.rows[0];
}

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
