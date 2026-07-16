export enum CellState {
    Empty = 0,
    Player1 = 1,
    Player2 = 2,
}

export interface GridPosition {
    x: number,
    y: number,
    z: number,
}