import { GridPosition, CellState, PLAYER_STATES } from "./Types.js"

export function delay(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function addGP(a: GridPosition, b: GridPosition): GridPosition {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z
    };
}

export function negateGP(a: GridPosition): GridPosition {
    return {
        x: -a.x,
        y: -a.y,
        z: -a.z
    };
}
