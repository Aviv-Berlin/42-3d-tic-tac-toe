import { query } from "./db.ts";



export async function getUserGames(id: number) {
	const result = await query(
		'SELECT * FROM matches WHERE (player1 = $1 OR player2 = $1) AND player2 != 1 ORDER BY started_at DESC;', [id]
	);
	return result;
}

export async function getMatchReplay(id: number) {
	const result = await query(
		'SELECT * FROM moves WHERE match_id = $1 ORDER BY move_nr;', [id]
	);

	return result;
}

export async function getRecentGames(id: number, limit: number) {
	const result = await query(
		'SELECT * FROM matches WHERE player1 = $1 OR player2 = $1 ORDER BY started_at DESC LIMIT $2;', [id, limit]
	);
	return result;
}

export async function getUserGameStats(id: number) {
	const result = await query(`
		SELECT
		CASE
			WHEN player2 = 2 THEN 'ai'
			ELSE 'online' END,
		COUNT(*) FILTER (WHERE winner = $1) AS wins,
		COUNT(*) FILTER (WHERE winner = null) AS draws,
		COUNT(*) FILTER (WHERE winner != $1) AS losses,
		COUNT(*) AS total
		FROM matches
		WHERE (player1 = $1 OR player2 = $1) AND player2 != 1
		GROUP BY
			CASE
				WHEN player2 = 2 THEN 'ai'
				ELSE 'online' END;
	`, [id]);
	const online = {
		wins: Number(result.rows[1]?.wins ?? 0),
		draws: Number(result.rows[1]?.draws ?? 0),
		losses: Number(result.rows[1]?.losses ?? 0)
	}
	const all = {
		wins: Number(result.rows[1]?.wins ?? 0) + Number(result.rows[0]?.wins ?? 0),
		draws: Number(result.rows[1]?.draws ?? 0) + Number(result.rows[0]?.draws ?? 0),
		losses: Number(result.rows[1]?.losses ?? 0) + Number(result.rows[0]?.losses ?? 0)
	}
	const stats = {
		online: online,
		all: all
	}
	return (stats);
}


export default {
	getUserGames,
	getMatchReplay,
	getRecentGames,
	getUserGameStats
};
