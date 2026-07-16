import { CellState, GridPosition} from "./GameState";

export class AIPlayer {

    public playAImove(boardState: CellState [][][], N: number): GridPosition | null {

        while(1)
        {
            const pos: GridPosition = {x: Math.floor(Math.random() * N),
                y: Math.floor(Math.random() * N), z: Math.floor(Math.random() * N),};
            if(boardState[pos.x][pos.y][pos.z] === 0)
                return pos;
        }
        return null;
    }
}