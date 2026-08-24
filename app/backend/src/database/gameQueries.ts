import { query } from "./db.ts";
import userQueries from "./userQueries.ts";
import { PlayerData, Move } from "../../../shared/game.ts";

export interface MatchEntry {
	id: number,
	player1: number,
	player2: number,
	winner: number,
	started_at: Date,
	ended_at: Date,
	board_size: number
  }
// Creating a game
export async function createMatchEntry(p1: PlayerData, p2: PlayerData, winner: PlayerData | null, start: number, end: number, board_size: number, moves: Move[]) {
	const p1user = await userQueries.getUserByUsername(p1.username);
	const p1id = p1user.id;
	const p2user = await userQueries.getUserByUsername(p2.username);
	const p2id = p2user.id;
	let winnerId = null;
	if (winner?.username === p1.username)
		winnerId = p1id;
	else if (winner?.username === p2.username)
		winnerId = p2id;

	const startDate = new Date(start);
	const endDate = new Date(end);
	// console.log(`p1: ${p1.type} ${p1.username}, p2: ${p2.type} ${p2.username}, winner: ${winner?.type} ${winner?.username}`);
	// console.log(`Adding to DB: p1:${p1id}, p2:${p2id}, winner:${winnerId}`);
	const result = await query(
		'INSERT INTO matches (player1, player2, winner, started_at, ended_at, board_size) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
		[p1id, p2id, winnerId, startDate, endDate, board_size]
	);
	createMoveHistory(moves, p1id, p2id, result.rows[0]);
	console.log(`match added to database`);
	return result.rows[0];
}
// move_nr INT NOT NULL,
// 	match_id INT NOT NULL REFERENCES matches(id),
// 	coord_x INT NOT NULL,
// 	coord_y INT NOT NULL,
// 	coord_z INT NOT NULL,
// 	player INT NOT NULL REFERENCES users(id),
// 	played_at INTERVAL NOT NULL,
export async function createMoveHistory(moves: Move[], p1: number, p2: number, match: MatchEntry) {
	const players = [0, p1, p2];
	for (let i = 0; i < moves.length; i++) {
		moves[i];
		await query(
			'INSERT INTO moves (move_nr, match_id, coord_x, coord_y, coord_z, player, played_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
			[i + 1, match.id, moves[i].pos.x, moves[i].pos.y, moves[i].pos.z, players[moves[i].player], moves[i].time])
	}
}

export default {
	createMatchEntry,

};
