import { FlowGraphAssetType } from "@babylonjs/core";
import { GameState, CellState, addGP, negateGP, type GridPosition, } from "./GameState";

const points: GridPosition[] = [
	{ x: -1, y: 1, z: 1 },
	{ x: 0, y: 1, z: 1 },
	{ x: 1, y: 1, z: 1 },
	{ x: -1, y: 0, z: 1 },
	{ x: 0, y: 0, z: 1 },
	{ x: 1, y: 0, z: 1 },
	{ x: -1, y: -1, z: 1 },
	{ x: 0, y: -1, z: 1 },
	{ x: 1, y: -1, z: 1 },
	{ x: -1, y: 1, z: 0 },
	{ x: 0, y: 1, z: 0 },
	{ x: 1, y: 1, z: 0 },
	{ x: 1, y: 0, z: 0 }
  ];

function checkForward(boardState: CellState[][][], startPos: GridPosition, player: CellState, vec: GridPosition): number {
	let count: number = 0;
	let checkPos: GridPosition = addGP(startPos, vec);
	while (boardState[checkPos.x]?.[checkPos.y]?.[checkPos.z] == player) {
		count++;
		checkPos = addGP(checkPos, vec);
	}
	return count;
}

function checkVector(boardState: CellState[][][], startPos: GridPosition, player: CellState, vec: GridPosition): number {
	let count: number = 0;
	count += checkForward(boardState, startPos, player, vec);
	count += checkForward(boardState, startPos, player, negateGP(vec));
	return count + 1;
}

export function checkWin(boardState: CellState[][][], pos: GridPosition, player: CellState, winAmt: number): boolean {
	let i = 0;
	while (points[i]) {
		if (checkVector(boardState, pos, player, points[i]) >= winAmt)
			return true;
		i++;
	}
	return false;
}
