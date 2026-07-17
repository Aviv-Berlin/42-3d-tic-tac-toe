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
