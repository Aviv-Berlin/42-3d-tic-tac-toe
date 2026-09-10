import { query } from "./db.ts";
import userQueries, { updateUserScores, User } from "./userQueries.ts";
import { PlayerData, Move, GameData, AiLevel } from "../../../shared/game.ts";

export interface MatchEntry {
	id: number,
	player1: number,
	player2: number,
	winner: number,
	difficulty: AiLevel,
	started_at: Date,
	ended_at: Date,
	board_size: number
  }

function calculateOnlineScore(game: GameData, p1: User, p2: User, winnerId: number | null) {
	const scoreDiff = Math.abs(p1.online_score - p2.online_score);
	let scoreBonus = scoreDiff / 30;
	if (scoreBonus > 30)
		scoreBonus = 30;
	let p1score = 0;
	if (winnerId === p1.id)
		p1score = game.size * 10 + scoreBonus;
	else
		p1score = -10 - (scoreBonus / 2);
	if (winnerId !== p1.id && winnerId !== p2.id)
		p1score = 0;
	return (Math.round(p1score));
}

function calculateAiScore(game: GameData, p1: User, p2: User, winnerId: number | null) {
	let p1score = 0;
	if (winnerId === p1.id)
		p1score = game.level * game.size * 3;
	else
		p1score = -30 / game.level;
	if (winnerId !== p1.id && winnerId !== p2.id)
		p1score = 0;
	return (Math.round(p1score));
}

// Creating a game
export async function createMatchEntry(game: GameData) {
	const p1user = await userQueries.getUserByUsername(game.player1.username);
	const p1id = p1user.id;
	const p2user = await userQueries.getUserByUsername(game.player2.username);
	const p2id = p2user.id;
	let winnerId = null;
	if (game.winner?.username === game.player1.username)
		winnerId = p1id;
	else if (game.winner?.username === game.player2.username)
		winnerId = p2id;

	const startDate = new Date(game.gameStart);
	const endDate = new Date(game.gameEnd);
	// console.log(`p1: ${p1.type} ${p1.username}, p2: ${p2.type} ${p2.username}, winner: ${winner?.type} ${winner?.username}`);
	// console.log(`Adding to DB: p1:${p1id}, p2:${p2id}, winner:${winnerId}`);
	const result = await query(
		'INSERT INTO matches (player1, player2, winner, difficulty, started_at, ended_at, board_size) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
		[p1id, p2id, winnerId, game.level, startDate, endDate, game.size]
	);
	createMoveHistory(game.moves, p1id, p2id, result.rows[0]);
	let p1score = 0
	let p2score = 0;
	let online = true;
	if (p2id === 2) {
		p1score = calculateAiScore(game, p1user, p2user, winnerId);
		p2score = calculateAiScore(game, p2user, p1user, winnerId);
		online = false;
	}
	else {
		p1score = calculateOnlineScore(game, p1user, p2user, winnerId);
		p2score = calculateOnlineScore(game, p2user, p1user, winnerId);
	}
	updateUserScores(p1user, p1score, online);
	updateUserScores(p2user, p2score, online);
	console.log(`match added to database`);
	return result.rows[0];
}

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
