import { query } from "./db.ts";
import userQueries from "./userQueries.ts";
import { PlayerData } from "../../../shared/game.ts";


// Creating a game
export async function createMatchEntry(p1: PlayerData, p2: PlayerData, winner: PlayerData, start: number, end: number) {
	const p1user = await userQueries.getUserByUsername(p1.username);
	const p1id = p1user.id;
	const p2user = await userQueries.getUserByUsername(p2.username);
	const p2id = p2user.id;
	let winnerId = null;
	if (winner.username === p1.username)
		winnerId = p1id;
	else if (winner.username === p2.username)
		winnerId = p2id;

	const startDate = new Date(start);
	const endDate = new Date(end);
	console.log(`p1: ${p1.type} ${p1.username}, p2: ${p2.type} ${p2.username}, winner: ${winner.type} ${winner.username}`);
	console.log(`Adding to DB: p1:${p1id}, p2:${p2id}, winner:${winnerId}`);
	const result = await query(
		'INSERT INTO matches (player1, player2, winner, started_at, ended_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;', [p1id, p2id, winnerId, startDate, endDate]
	);

	console.log(`match added to database`);
	return result.rows[0];
}



export default {
	createMatchEntry,

};
