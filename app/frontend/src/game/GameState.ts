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
    private onExit: () => void; //this is a function that is called when game is over
    private exitTimeout: ReturnType<typeof setTimeout> | null = null;
    private aiTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor(N: number, ui: GameUI, player1: string, player2: string, graphics: GameGraphics, onExit: () => void) {
        this.N = N;
        this.ui = ui;
        this.player1 = player1;
        this.player2 = player2;
        this.graphics = graphics;
        this.onExit = onExit;

        this.initBoard();
        this.cursor = {x: this.N -1, y: this.N - 1, z: this.N- 1};
        this.ui.playerTitle(player1);
        this.updatePreview();

    }

    public moveCursor(direction: boolean, plane: "x" | "y" | "z"): void {
        if (this.gameOver)
            return;

        if (this.currentPlayer !== CellState.Player1) // no cursor control whil AI is playing
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

        while (!this.isCellEmpty(this.cursor) && tries < maxTries) {
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
        if (this.currentPlayer !== CellState.Player1) // prevent player from putting sphere while AI moves.
            return false;
        return this.placeMoveAt({...this.cursor});
    }

    public placeMoveAt(pos: GridPosition): boolean {
        if (this.gameOver)
            return false;

        if (!this.isCellEmpty(pos))
            return false;

        //const playerWhoMoved = this.currentPlayer;

        this.boardState[pos.x][pos.y][pos.z] = this.currentPlayer;

        this.graphics.placeMove(pos, this.currentPlayer);

        const winningPositions = checkWin(this.boardState, pos, this.currentPlayer, this.N);

        if (winningPositions) {
            this.finishGame(this.currentPlayer, winningPositions);
            return true;
        }

        this.switchPlayer();

        if(this.currentPlayer === CellState.Player2) 
        {
            this.graphics.hidePreview();
            this.randomMove();
        }
        else
        {
            this.advanceCursor();
            this.updatePreview();
        }

        return true;
    }

    private finishGame(winner: CellState, winningPositions: GridPosition[]): void {
        this.gameOver = true;
        this.graphics.hidePreview();
        this.graphics.animateWin(winningPositions);
        if (this.currentPlayer === CellState.Player1)
            this.ui.displayWinner(this.player1);
        else
            this.ui.displayWinner(this.player2);
        this.exitTimeout = setTimeout(() => { this.onExit();}, 2000);
    }

    private randomMove(): void {
        this.aiTimeout = setTimeout(() => {
            this.aiTimeout = null;
            if (this.gameOver)
                return;
            if (this.currentPlayer !== CellState.Player2)
                return;
            const randomPosition = this.getRandomEmptyCell();
            if (randomPosition === null) {
                // The board is full.
                this.endGameDraw();
                return;
            }
            this.placeMoveAt(randomPosition);
        }, 500);
    }

    private getRandomEmptyCell(): GridPosition | null {
        const emptyCells: GridPosition[] = [];

        for (let x = 0; x < this.N; x++) {
            for (let y = 0; y < this.N; y++) {
                for (let z = 0; z < this.N; z++) {
                    const pos: GridPosition = {x,y,z};
                    if (this.isCellEmpty(pos))
                        emptyCells.push(pos);
                }
            }
        }
        if (emptyCells.length === 0)
            return null;
        const randomNumber = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomNumber];
    }

    private endGameDraw() {
        this.gameOver = true;
        this.graphics.hidePreview();
        this.ui.displayWinner("No One");
        this.exitTimeout = setTimeout(() => { this.onExit();}, 2000);
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

    public dispose(): void {
        if (this.exitTimeout !== null) {
            clearTimeout(this.exitTimeout);
            this.exitTimeout = null;
        }  
    }

        
    private playRandomMove(boardState: CellState [][][], N: number): GridPosition | null {
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
