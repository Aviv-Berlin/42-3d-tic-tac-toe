

export enum CellState {
    Empty = 0;
    Player1 = 1;
    Player2 = 2;
}

export interface GridPosition {
    x: number,
    y: number,
    z: number,
}

export class GameState {
    private boardState: CellState [][][] = [];
    private currentPlayer: CellState = CellState.Player1;
    private N;

    constructor(_N: number) {
        this.N = _N;
        this.initBoard();
    }

    private initBoard() {
        for(let x = 0; x < this.N; x++)
        {
            this.boardState[x] = [];
            for(let y = 0; y < this.N; y++)
            {
                this.boardState[x][y] = [];
                for(let z = 0; z < this.N ; z++)
                    this.boardState[x][y][z] = CellState.Empty;
            }
        }
    }

    public isCellEmpty(pos: GridPosition): boolean {
        return this.boardState[pos.x][pos.y][pos.z] === CellState.Empty;
    }

    public getCurrentPlayer(): CellState {
        return this.currentPlayer;
    }
}