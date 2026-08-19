import { checkWin } from "./GameCheckWin.ts";
import { GridPosition, CellState } from "../../../shared/game/Types.ts";
import { GameData, PlayerData } from "../../../shared/game.js";
import { WebSocket } from "ws";
import { AiPlayer } from "./AIPlayer.ts"
import { WsMessage, createEndMessage, createGameStartMessage, CreateTurnMessage, createMoveMessage } from "../../../shared/messages.ts"


interface RemotePlayer {
  type: "remote";
  name: string;
  socket: WebSocket | null;
}

interface AiGamePlayer {
  type: "ai";
  name: string;
  ai: AiPlayer;
}

type GamePlayer = RemotePlayer | AiGamePlayer;

export class GameState {
    private boardState: CellState [][][] = [];
    private N: number;
    private players: GamePlayer[] = [];
    private playerNames: string[] = [];
    private currentPlayerIndex: number = 0;
    private nPlayers: number;
    private moveCounter: number = 0;
    private gameOver: boolean = false;
    private exitTimeout: ReturnType<typeof setTimeout> | null = null;
    private gameData: GameData;

    constructor(gameData: GameData, nPlayers: number) {
        if (nPlayers < 2 || nPlayers > 4)
            throw new Error("The game supports between 2 and 4 players");
        this.gameData = gameData;
        this.gameData.isFinished = false;
        this.gameData.winner = null;
        this.gameData.isDraw = false;
        this.N = gameData.size;
        this.nPlayers = nPlayers;
        this.initBoard();
    }

    public async startGame(): Promise<void> {
        if (this.gameData.gameStart > 0){
			console.log("game already started")
            return ;
		}
        if (this.players.length < this.nPlayers) {
            console.log(`Still waiting for players`);
            return ;
        }
        this.gameData.gameStart = Date.now();
        const msg = createGameStartMessage(this.gameData.gameID, this.playerNames, this.nPlayers, 0);
        console.log("Sending game-start messages");
        this.disributeMessage(msg);
        console.log("Finished sending game-start messages");


        if (this.gameData.moves === null)
            this.gameData.moves = [];
        console.log(`handing yourTurn to player`);
        this.currentPlayerIndex = Math.floor(Math.random() * this.players.length);
        this.disributeMessage(CreateTurnMessage(this.gameData.gameID, this.currentPlayerIndex));
	}

    private disributeMessage(msg: WsMessage) {
        for (let i = 0; i < this.players.length; i++) {
            let outgoingMessage: WsMessage = msg;
            if (msg.type === "game-start")
                outgoingMessage = { ...msg, payload: { ...msg.payload, youAre: i, }, };
            const player = this.players[i];
            if (player.type === "remote")
                player.socket?.send(JSON.stringify(outgoingMessage));
            else
                player.ai.handleMessage(outgoingMessage);
        }
    }

    public placeMove(pos: GridPosition, playerState: CellState): boolean {
        if (this.gameOver)
            return false;
        if (!this.isCellEmpty(pos))
            return false;
        //do we need to do here a check that the right player actually made the move?
        this.moveCounter++;
        this.boardState[pos.x][pos.y][pos.z] = playerState;
        this.gameData.moves.push({ pos: pos, player: playerState });
        this.disributeMessage(createMoveMessage(this.gameData.gameID, playerState, this.currentPlayerIndex, pos));
        const winningPositions = checkWin(this.boardState, pos, playerState, this.N);
        if (winningPositions) {
            this.finishGame(this.currentPlayerIndex, winningPositions);
            console.log(`game won!`);
            return true;
        }
        if (this.moveCounter >= this.N * this.N * this.N) {
            this.endGameDraw();
            return false;
        }
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.disributeMessage(CreateTurnMessage(this.gameData.gameID, this.currentPlayerIndex));
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

    public playerExit(ws: WebSocket, playerIndex: number) {
        this.gameData.isFinished = true;
        this.gameData.gameEnd = Date.now();
        this.gameData.endMessage = `${this.playerNames[playerIndex]} has left the game`;
        this.disributeMessage(createEndMessage(this.gameData, null, playerIndex));
    }

    public isCellEmpty(pos: GridPosition): boolean {
        return this.boardState[pos.x][pos.y][pos.z] === CellState.Empty;
    }


    public getCell(pos: GridPosition): CellState {
        return this.boardState[pos.x][pos.y][pos.z];
    }


    private finishGame(winner: number, winningPositions: GridPosition[]): void {
        this.gameOver = true;
        this.gameData.isFinished = true;
        const winningPlayer = this.players[winner];
        const winnerData: PlayerData = {
            username: this.playerNames[winner],
            type:
                winningPlayer.type === "ai"
                    ? "ai"
                    : this.playerNames[winner] === "guest"
                        ? "guest"
                        : "real",
        };
        this.gameData.winner = winnerData;
        this.gameData.gameEnd = Date.now();
        this.disributeMessage(createEndMessage(this.gameData, winningPositions, -1));
    }

    private endGameDraw() {
        this.gameOver = true;
        this.gameData.isFinished = true;
        this.gameData.isDraw = true;
        this.gameData.gameEnd = Date.now();
        this.disributeMessage(createEndMessage(this.gameData, null, -1));
    }

    public dispose(): void {
        if (this.exitTimeout !== null) {
            clearTimeout(this.exitTimeout);
            this.exitTimeout = null;
        }
    }

    public getID() {
        return this.gameData.gameID;
    }

    public addPlayer(socket: WebSocket | null, name: string) {
        for (const player of this.players) {
            if (player.type === "remote" && player.socket === socket) {
                return ;
            }
        }
        if (this.players.length >= this.nPlayers) {
            console.log(`enough players already ${this.players.length} ${this.nPlayers}`)
            return;
        }
        this.players.push({ type: "remote", name, socket });
        this.playerNames.push(name);
        console.log(`players: ${Array.from(this.playerNames)}`);
    }

    public addAiPlayer(ai: AiPlayer, name: string): void {
        this.players.push({ type: "ai", name, ai, });
        this.playerNames.push(name);
    }

    public getBoardState(): CellState [][][] {
        return this.boardState;
    }

    public removeGame(games: GameState[]) {
        const index = games.findIndex(game => game.getID() === this.gameData.gameID);
        if (index !== -1)
            games.splice(index, 1);
    }

    public handleDisconnect(ws: WebSocket) {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if (player.type === "remote" && player.socket === ws) {
                console.log("player quit game");
                //here the game should send message to everyone that this player quit
            }
        }
    }
}
