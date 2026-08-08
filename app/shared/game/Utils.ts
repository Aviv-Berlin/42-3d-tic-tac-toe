import { GridPosition, CellState, PLAYER_STATES } from "./Types"

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

export function playerStateToIndex(state: CellState): number {
    const index = PLAYER_STATES.indexOf(state);

    if (index === -1) {
        throw new Error(
            `CellState ${state} does not represent a player`
        );
    }

    return index;
}
