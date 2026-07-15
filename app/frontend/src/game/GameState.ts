import { FlowGraphAssetType } from "@babylonjs/core";
import { GameUI } from "./GameUI";
import { checkWin } from "./GameCheckWin";
import { GameGraphics } from "./GameGraphics";



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

export class GameState {
    private boardState: CellState [][][] = [];
    private currentPlayer: CellState = CellState.Player1;
    private N;
    private ui: GameUI;
    private player1: string;
    private player2: string;
    private graphics: GameGraphics;
    private cursor: GridPosition;
    private gameOver: boolean = false;

    constructor(N: number, ui: GameUI, player1: string, player2: string, graphics: GameGraphics) {
        this.N = N;
        this.ui = ui;
        this.player1 = player1;
        this.player2 = player2;
        this.graphics = graphics;

        this.initBoard();
        this.cursor = {x: this.N -1, y: this.N - 1, z: this.N- 1};
        this.ui.playerTitle(player1);
        this.updatePreview();

    }

    public moveCursor(direction: boolean, plane: "x" | "y" | "z"): void {
        if (this.gameOver)
            return;

        const movement = direction ? 1 : -1;

        this.cursor[plane] = this.loopPlacement(this.cursor[plane] + movement);

        this.updatePreview();
    }

    private updatePreview(): void {
        const foundEmptyCell = this.findNextEmptyCell();

        if (!foundEmptyCell) {
            this.graphics.hidePreview();
            return;
        }
        this.graphics.showPreview(this.cursor, this.currentPlayer);
    }

    private findNextEmptyCell(): boolean {
        const maxTries = this.N * this.N * this.N;
        let tries = 0;

        while (
            !this.isCellEmpty(this.cursor) &&
            tries < maxTries
        ) {
            this.advanceCursor();
            tries++;
        }

        return tries < maxTries;
    }


    private loopPlacement(value: number): number {
        if (value >= this.N)
            return 0;

        if (value < 0)
            return this.N - 1;

        return value;
    }


    public getCursorPosition(): GridPosition {
        return { ...this.cursor };
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
        
        const winningPostions = checkWin(this.boardState, pos, this.currentPlayer, this.N)
        if(winningPostions)
            
            console.log("Player" + this.currentPlayer + "wins!");
        else
            console.log("No win detected.");
        this.switchPlayer();
        return true;
    }

    private switchPlayer() {
        if (this.currentPlayer === CellState.Player1)
        {
            this.currentPlayer = CellState.Player2;
            this.ui.playerTitle(this.player2);
        }
        else
        {
            this.currentPlayer = CellState.Player1;
            this.ui.playerTitle(this.player1);

        }
    }

    public getCell(pos: GridPosition): CellState {
        return this.boardState[pos.x][pos.y][pos.z];
    }

    public reset() {
        this.initBoard();
        this.currentPlayer = CellState.Player1;
        this.ui.playerTitle(this.player1);
    }

public placeSphere(): boolean {
        if (this.gameOver)
            return false;

        if (!this.isCellEmpty(this.cursor))
            return false;



        this.boardState[this.cursor.x][this.cursor.y][this.cursor.z] = this.currentPlayer;

        this.graphics.placeMove(this.cursor, this.currentPlayer);

        const winningPositions = checkWin(this.boardState, this.cursor, this.currentPlayer, this.N);

        if (winningPositions) {
            console.log(`Player ${this.currentPlayer} wins!`);

            this.graphics.animateWin(winningPositions);
            this.graphics.hidePreview();
            this.gameOver = true;

            return true;
        }

        this.switchPlayer();

        this.advanceCursor();
        this.updatePreview();

        return true;
    }

    public getCursor(): GridPosition {
        return this.cursor;
    }

    private advanceCursor(): void {
    this.cursor.x--;

    if (this.cursor.x < 0) {
        this.cursor.x =  this.N - 1;
        this.cursor.y--;
    }

    if (this.cursor.y < 0) {
        this.cursor.y = this.N - 1;
        this.cursor.z--;
    }

    if (this.cursor.z < 0) {
        this.cursor.z = this.N - 1;
    }
}
}
