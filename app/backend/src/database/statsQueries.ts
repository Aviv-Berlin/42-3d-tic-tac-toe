import { db } from './db.js'
import { matchesTable, movesTable } from './schema.js';
import { eq, ne, sql, or, desc, and } from 'drizzle-orm';


export async function getUserGames(id: number) {
	const result = await db
	.select()
	.from(matchesTable)
	.where(or(eq(matchesTable.player1, id), eq(matchesTable.player2, id)))
	.orderBy(desc(matchesTable.startedAt));

	return result;
}

export async function getMatchReplay(id: number) {
	const result = await db
	.select()
	.from(movesTable)
	.where(eq(movesTable.matchId, id))
	.orderBy(movesTable.moveNr);

	return result;
}

export async function getRecentGames(id: number, limit: number) {
	const result = await db
	.select()
	.from(matchesTable)
	.where(or(eq(matchesTable.player1, id), eq(matchesTable.player2, id)))
	.orderBy(desc(matchesTable.startedAt))
	.limit(limit);

	return result;
}

export async function getUserGameStats(id: number) {
	const onlineResult = await db
	.select({
		wins: sql<number>`COUNT(*) FILTER (WHERE winner = ${id})`.as('wins'),
		draws: sql<number>`COUNT(*) FILTER (WHERE winner = null)`.as('draws'),
		losses: sql<number>`COUNT(*) FILTER (WHERE winner != $1)`.as('losses'),
	}).from(matchesTable)
	.where(and(ne(matchesTable.player2, 2), or(eq(matchesTable.player1, id), eq(matchesTable.player2, id))));

	const allResult = await db
	.select({
		wins: sql<number>`COUNT(*) FILTER (WHERE winner = ${id})`.as('wins'),
		draws: sql<number>`COUNT(*) FILTER (WHERE winner = null)`.as('draws'),
		losses: sql<number>`COUNT(*) FILTER (WHERE winner != $1)`.as('losses'),
	}).from(matchesTable)
	.where(or(eq(matchesTable.player1, id), eq(matchesTable.player2, id)));

	// query(`
	// 	SELECT
	// 	CASE
	// 		WHEN player2 = 2 THEN 'ai'
	// 		ELSE 'online' END,
	// 	COUNT(*) FILTER (WHERE winner = $1) AS wins,
	// 	COUNT(*) FILTER (WHERE winner = null) AS draws,
	// 	COUNT(*) FILTER (WHERE winner != $1) AS losses,
	// 	COUNT(*) AS total
	// 	FROM matches
	// 	WHERE (player1 = $1 OR player2 = $1) AND player2 != 1
	// 	GROUP BY
	// 		CASE
	// 			WHEN player2 = 2 THEN 'ai'
	// 			ELSE 'online' END;
	// `, [id]);
	const online = {
		wins: Number(onlineResult[0]?.wins ?? 0),
		draws: Number(onlineResult[0]?.draws ?? 0),
		losses: Number(onlineResult[0]?.losses ?? 0)
	}
	const all = {
		wins: Number(allResult[0]?.wins ?? 0),
		draws: Number(allResult[0]?.draws ?? 0),
		losses: Number(allResult[0]?.losses ?? 0)
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
