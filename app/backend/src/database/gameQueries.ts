import userQueries, { updateUserScores, getOnlineScoreByID } from "./userQueries.js";
import { Move, GameData } from "../../../shared/game.js";
import { db } from './db.js'
import { matchesTable, movesTable } from './schema.js';

export interface MatchEntry {
	id: number,
	player1: number,
	player2: number,
	winner: number | null,
	difficulty: number | null,
	startedAt: Date,
	endedAt: Date,
	boardSize: number
  }

async function calculateOnlineScore(game: GameData, p1ID: number, p2ID: number, winnerId: number | null) {
	const p1Score = await getOnlineScoreByID(p1ID) ?? 0;
	const p2Score = await getOnlineScoreByID(p2ID) ?? 0;
	const scoreDiff = Math.abs(p1Score - p2Score);
	let scoreBonus = scoreDiff / 30;
	if (scoreBonus > 30)
		scoreBonus = 30;
	let score = 0;
	if (winnerId === p1ID)
		score = game.size * 10 + scoreBonus;
	else {
		score = -10;
		if (p1ID > p2ID)
			score =- (scoreBonus / 2);
	}
	if (winnerId !== p1ID && winnerId !== p2ID)
		score = 0;
	console.log(`p1Score: ${p1Score}, p2Score: ${p2Score}, scoreBonus: ${scoreBonus}, score: ${score}`);
	return (Math.round(score));
}

function calculateAiScore(game: GameData, p1ID: number, p2ID: number, winnerId: number | null) {
	let p1score = 0;
	if (winnerId === p1ID)
		p1score = game.level * game.size * 3;
	else
		p1score = -30 / game.level;
	if (winnerId !== p1ID && winnerId !== p2ID)
		p1score = 0;
	return (Math.round(p1score));
}

// Creating a game
export async function createMatchEntry(game: GameData) {
	const p1id = await userQueries.getUserIdByUsername(game.player1.username);
	const p2id = await userQueries.getUserIdByUsername(game.player2.username);

		let winnerId = null;
	if (game.winner?.username === game.player1.username)
		winnerId = p1id;
	else if (game.winner?.username === game.player2.username)
		winnerId = p2id;

	const startDate = new Date(game.gameStart);
	const endDate = new Date(game.gameEnd);
	// console.log(`p1: ${p1.type} ${p1.username}, p2: ${p2.type} ${p2.username}, winner: ${winner?.type} ${winner?.username}`);
	// console.log(`Adding to DB: p1:${p1id}, p2:${p2id}, winner:${winnerId}`);
	const result = await db
	.insert(matchesTable)
	.values({
		player1: p1id,
		player2: p2id,
		winner: winnerId,
		difficulty: game.level,
		startedAt: startDate,
		endedAt: endDate,
		boardSize: game.size
	}).returning({id: matchesTable.id});
	createMoveHistory(game.moves, p1id, p2id, result[0]?.id);
	let p1score = 0
	let p2score = 0;
	let online = true;
	if (p2id === 2) {
		p1score = calculateAiScore(game, p1id, p2id, winnerId);
		p2score = calculateAiScore(game, p2id, p1id, winnerId);
		online = false;
	}
	else {
		p1score = await calculateOnlineScore(game, p1id, p2id, winnerId);
		p2score = await calculateOnlineScore(game, p2id, p1id, winnerId);
	}
	updateUserScores(p1id, p1score, online);
	updateUserScores(p2id, p2score, online);
	console.log(`match added to database`);
	return result[0].id;
}

export async function createMoveHistory(moves: Move[], p1: number, p2: number, id: number) {
	const players = [0, p1, p2];
	for (let i = 0; i < moves.length; i++) {
		await db
		.insert(movesTable)
		.values({
			moveNr: i + 1,
			matchId: id,
			coordX: moves[i].pos.x,
			coordY: moves[i].pos.y,
			coordZ: moves[i].pos.z,
			player: players[moves[i].player],
			playedAt: moves[i].time
		});
	}
}

export default {
	createMatchEntry,

};
