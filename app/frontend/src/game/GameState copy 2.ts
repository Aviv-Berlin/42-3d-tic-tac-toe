import { FlowGraphAssetType } from "@babylonjs/core";
import { GameUI } from "./GameUI";
import { checkWin } from "./GameCheckWin";
import { GameGraphics } from "./GameGraphics";
import { GridPosition, CellState, GameData } from "./Types"


interface registerPlayer {
    name: string;
}

interface playerMethods {
    getData: (name: string) => GameData;
    sendPing: (name: string) => number;
    placeMove: (name: string, pos: GridPosition) => boolean;
}



export class GameState {
    private boardState: CellState [][][] = [];
    private currentPlayer: CellState = CellState.Player1;
    private currentName: string = "";
    private N;
    private ui: GameUI;
    private player1: string = "";
    private player1LastPing: number | null = null;
    private player2: string = "";
    private player2LastPing: number | null = null;
    private graphics: GameGraphics;
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
        if (Math.floor(Math.random() * N) === 0)
            this.currentPlayer = CellState.Player1;
        else 
            this.currentPlayer = CellState.Player2;
    }

    public register(player: registerPlayer): playerMethods {
        if (this.player1 === "") {
            this.player1 = player.name;
            this.player1LastPing = Date.now();
        }
        else {
            this.player2 = player.name;
            this.player1LastPing = Date.now();
        }
        let name = player.name;

        return {

           getData: (name: string): GameData => {
                let whoAreYou: CellState;
                if (player.name === this.player1)
                    whoAreYou = CellState.Player1;
                else
                    whoAreYou = CellState.Player2;
                const data: GameData = {
                    YouAre: whoAreYou,
                    N: this.N,
                    boardState: this.boardState
                };    
                return data;
           },

           sendPing: (name: string): number => {    
                if (this.gameOver)
                    return 3;
                if (player.name === this.player1) {
                    this.player1LastPing = Date.now();
                    if (this.currentPlayer === CellState.Player1)
                        return 1;
                    else
                        return 2;
                }
                else {
                    this.player2LastPing = Date.now();
                    if (this.currentPlayer === CellState.Player2)
                        return 1;
                    else
                        return 2;
                }
                return 1 // 1 your turn, 2 other players turn, 3 game is over
           }, 
            
           placeMove: (name: string, pos: GridPosition): boolean => {
                if (this.gameOver)
                    return false;
                if (this.player1 === name)
                if (!this.isCellEmpty(pos))
                    return false;
                this.boardState[pos.x][pos.y][pos.z] = this.currentPlayer;
                this.graphics.placeMove(pos, this.currentPlayer);

                const winningPositions = checkWin(this.boardState, pos, this.currentPlayer, this.N);
                if (winningPositions) {
                    this.finishGame(this.currentPlayer, winningPositions);
                    return true;
                }

                this.switchPlayer();
                return true;
           }

        };
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
            this.currentName = this.player2;
        }
        else
        {
            this.currentPlayer = CellState.Player1;
            this.currentName = this.player1;
        }
        this.ui.playerTitle(this.currentName);
    }

    public getCell(pos: GridPosition): CellState {
        return this.boardState[pos.x][pos.y][pos.z];
    }

    public reset() {
        this.initBoard();
        this.currentPlayer = CellState.Player1;
        this.ui.playerTitle(this.player1);
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





    public dispose(): void {
        if (this.exitTimeout !== null) {
            clearTimeout(this.exitTimeout);
            this.exitTimeout = null;
        }  
    }

        


}
