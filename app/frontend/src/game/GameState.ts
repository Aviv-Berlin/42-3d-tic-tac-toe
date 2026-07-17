import { GameUI } from "./GameUI";
import { checkWin } from "./GameCheckWin";
import { GameGraphics } from "./GameGraphics";
import { GridPosition, CellState, GameData } from "./Types";
import { Player } from "./Player";


interface NewPlayer {
    name: string;
    yourTurn(BoardState: CellState[][][], N: number): boolean;
}




export class GameState {
    private boardState: CellState [][][] = [];
    private currentPlayer: CellState = CellState.Player1; 
    private currentName: string = "";
    private N;
    private ui: GameUI;
    private taken1: boolean = false;
    private player1: Player | null = null;
    private player2: Player | null = null;
    private moveCounter: number = 0;
    private graphics: GameGraphics;
    private gameOver: boolean = false;
    private onExit: () => void; //this is a function that is called when game is over
    private exitTimeout: ReturnType<typeof setTimeout> | null = null;
    private aiTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor(N: number, ui: GameUI, graphics: GameGraphics, onExit: () => void) {
        this.N = N;
        this.ui = ui;
        this.graphics = graphics;
        this.onExit = onExit;

        this.initBoard();

    }
    public register(player: Player): void {
        if (this.player1 === null) {
            this.player1 = player;
            return;
        }
        if (this.player2 === null) {
            this.player2 = player;
            return;
        }

        throw new Error("Two Pplayers are already registered");
    }

    public startGame(): void {
        if (this.player1 === null || this.player2 === null)
            throw new Error("Cannot start wihtout two players");

        if (Math.floor(Math.random() * 2) === 0) {
            this.currentPlayer = CellState.Player1;
            this.currentName = this.player1.name;
            this.player1.yourTurn(this.boardState, this.N, CellState.Player1);
        }
        else { 
            this.currentPlayer = CellState.Player2;
            this.currentName = this.player2.name;
            this.player2.yourTurn(this.boardState, this.N, CellState.Player2);
        }
        this.ui.playerTitle(this.currentName);
    }

    public placeMove(pos: GridPosition): boolean {
        if (this.gameOver)
            return false;
        if (this.moveCounter >= this.N * this.N * this.N) {
            this.endGameDraw();
            return false;
        }
        this.moveCounter++;
        this.boardState[pos.x][pos.y][pos.z] = this.currentPlayer;
        this.graphics.placeSphere(pos, this.currentPlayer);

        const winningPositions = checkWin(this.boardState, pos, this.currentPlayer, this.N);
        if (winningPositions) {
            this.finishGame(this.currentPlayer, winningPositions);
            return true;
        }
        this.switchPlayer();
        return true;
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
        if (this.player1 === null || this.player2 === null)
            throw new Error("Cannot switch wihtout two players");
        
        if (this.currentPlayer === CellState.Player1)
        {
            this.currentPlayer = CellState.Player2;
            this.currentName = this.player2.name;
            this.player2.yourTurn(this.boardState, this.N, CellState.Player2);
        }
        else
        {
            this.currentPlayer = CellState.Player1;
            this.currentName = this.player1.name;
            this.player1.yourTurn(this.boardState, this.N, CellState.Player2);
        }
        this.ui.playerTitle(this.currentName);
    }

    public getCell(pos: GridPosition): CellState {
        return this.boardState[pos.x][pos.y][pos.z];
    }



    private finishGame(winner: CellState, winningPositions: GridPosition[]): void {
        if (this.player1 === null || this.player2 === null)
            throw new Error("Cannot finish wihtout two players");
        this.gameOver = true;
        this.graphics.hidePreview();
        this.graphics.animateWin(winningPositions);
        if (this.currentPlayer === CellState.Player1)
            this.ui.displayWinner(this.player1.name);
        else
            this.ui.displayWinner(this.player2.name);
        this.exitTimeout = setTimeout(() => { this.onExit();}, 2000);
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
