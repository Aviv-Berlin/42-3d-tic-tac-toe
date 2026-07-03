import { GameUI } from "./GameUI.ts";

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

export class GameState {
    private boardState: CellState [][][] = [];
    private currentPlayer: CellState = CellState.Player1;
    private N;
    private ui: GameUI;

    constructor(N: number, ui: GameUI) {
        this.N = N;
        this.initBoard();
        this.ui = ui;
        this.ui.playerTitle("Player 1");
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

    public placePiece(pos: GridPosition): boolean {
        if (!this.isCellEmpty(pos))
            return false;
        this.boardState[pos.x][pos.y][pos.z] = this.currentPlayer;
        this.switchPlayer();
        return true;
    }

    private switchPlayer() {
        if (this.currentPlayer === CellState.Player1)
        {
            this.currentPlayer = CellState.Player2;
            this.ui.playerTitle("Player 2");
        }
        else
        {
            this.currentPlayer = CellState.Player1;
            this.ui.playerTitle("Player 1");

        }
    }

    public getCell(pos: GridPosition): CellState {
        return this.boardState[pos.x][pos.y][pos.z];
    }

    public reset() {
        this.initBoard();
        this.currentPlayer = CellState.Player1;
        this.ui.playerTitle("Player 1");
    }
}