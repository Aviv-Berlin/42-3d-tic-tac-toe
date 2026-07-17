export enum CellState {
    Empty = 0,
    Player1 = 1,
    Player2 = 2,
    Player3 = 3,
    Player4 = 4,
}

export interface GridPosition {
    x: number,
    y: number,
    z: number,
}

export const PLAYER_STATES: readonly CellState[] = [
    CellState.Player1,
    CellState.Player2,
    CellState.Player3,
    CellState.Player4,
];

export const points: GridPosition[] = [
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
