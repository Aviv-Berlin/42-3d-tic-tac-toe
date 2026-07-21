import { GameUI } from "./GameUI";
import { checkWin } from "./GameCheckWin";
import { GameGraphics } from "./GameGraphics";
import { GridPosition, CellState, PLAYER_STATES} from "./Types";
import { Player } from "./Player";


interface NewPlayer {
    name: string;
    yourTurn(BoardState: CellState[][][], N: number): boolean;
}


export class GameState {
    private boardState: CellState [][][] = [];
    private N: number;
    private ui: GameUI;
    private players: Player[] = [];
    private currentPlayerIndex: number = 0;
    private nPlayers: number;
    private moveCounter: number = 0;
    private graphics: GameGraphics;
    private gameOver: boolean = false;
    private onExit: () => void; //this is a function that is called when game is 
    private exitTimeout: ReturnType<typeof setTimeout> | null = null;

    constructor(N: number, ui: GameUI, graphics: GameGraphics, onExit: () => void, nPlayers: number) {
        if (nPlayers < 2 || nPlayers > 4)
            throw new Error("The game supports between 2 and 4 players");
        this.N = N;
        this.ui = ui;
        this.graphics = graphics;
        this.onExit = onExit;
        this.nPlayers = nPlayers;


        this.initBoard();
    }
    public register(player: Player): void {
        if (this.players.length >= this.nPlayers)
            throw new Error("Too many players were registered");

        this.players.push(player);
    }

    public startGame(): void {
        if (this.players.length < this.nPlayers)
            throw new Error("Not enough players");

        this.currentPlayerIndex = Math.floor(Math.random() * this.nPlayers);
        this.ui.playerTitle(this.getCurrentPlayer().name);
        this.getCurrentPlayer().yourTurn(this.boardState, this.N, this.getCurrentPlayerState());
    }



    public placeMove(pos: GridPosition): boolean {
        if (this.gameOver)
            return false;
        if (!this.isCellEmpty(pos))
            return false;


        const playerState = this.getCurrentPlayerState();
        this.moveCounter++;
        this.boardState[pos.x][pos.y][pos.z] = playerState;
        this.graphics.placeSphere(pos, playerState);

        const winningPositions = checkWin(this.boardState, pos, playerState, this.N);
        if (winningPositions) {
            this.finishGame(this.getCurrentPlayer(), winningPositions);
            return true;
        }
        if (this.moveCounter >= this.N * this.N * this.N) {
            this.endGameDraw();
            return false;
        }
        this.switchPlayer();
        return true;
    }

    private initBoard() {
        for(let x = 0; x < this.N; x++) {
            this.boardState[x] = [];
            for(let y = 0; y < this.N; y++) {
                this.boardState[x][y] = [];
                for(let z = 0; z < this.N ; z++)
                    this.boardState[x][y][z] = CellState.Empty;
            }
        }
    }

    public isCellEmpty(pos: GridPosition): boolean {
        return this.boardState[pos.x][pos.y][pos.z] === CellState.Empty;
    }

    public getCurrentPlayer(): Player {
        const player = this.players[this.currentPlayerIndex];
        if (player === undefined) {
            throw new Error("Current player has not been registered");
        }
        return player;
    }

    public getCurrentPlayerState(): CellState {
        const state = PLAYER_STATES[this.currentPlayerIndex];

        if (state === undefined) {
            throw new Error("Current player has no CellState");
        }

        return state;
    }

    private switchPlayer(): void {
        this.currentPlayerIndex =
            (this.currentPlayerIndex + 1) % this.players.length;

        this.ui.playerTitle(this.getCurrentPlayer().name);
        this.getCurrentPlayer().yourTurn(this.boardState, this.N, this.getCurrentPlayerState());
    }    

    public getCell(pos: GridPosition): CellState {
        return this.boardState[pos.x][pos.y][pos.z];
    }



    private finishGame(winner: Player, winningPositions: GridPosition[]): void {
        this.gameOver = true;
        this.graphics.hidePreview();
        this.graphics.animateWin(winningPositions);
        this.ui.displayWinner(winner.name);
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
