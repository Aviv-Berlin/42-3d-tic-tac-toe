import { addGP, negateGP, } from "./Utils";
import { GridPosition, CellState } from "./Types"



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

function checkForward(boardState: CellState[][][], startPos: GridPosition, player: CellState, vec: GridPosition): GridPosition[] {
	const positions: GridPosition[] = [];
	//let count: number = 0;
	let checkPos: GridPosition = addGP(startPos, vec);
	while (boardState[checkPos.x]?.[checkPos.y]?.[checkPos.z] == player) {
		//count++;
		positions.push(checkPos);
		checkPos = addGP(checkPos, vec);
	}
	return positions;
}

function checkVector(boardState: CellState[][][], startPos: GridPosition, player: CellState, vec: GridPosition): GridPosition[] {
	//const positions: GridPosition[] = [];
	//let count: number = 0;
	const forward = checkForward(boardState, startPos, player, vec);
	const backward = checkForward(boardState, startPos, player, negateGP(vec));
	return [...backward.reverse(), {...startPos}, ...forward];
}

export function checkWin(boardState: CellState[][][], pos: GridPosition, player: CellState, winAmt: number): GridPosition[] | null {
	let i = 0;
	while (points[i]) {
		const winningPositions = checkVector(boardState, pos, player, points[i])
		if (winningPositions.length >= winAmt)
			return winningPositions;
		i++;
	}
	return null;
}
