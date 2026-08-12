import { GameUI } from "./GameUI";
import { GameGraphics } from "./GameGraphics";
import { LocalPlayer } from "./LocalPlayer"
import { GameData } from "../../../shared/game";
import { GridPosition, CellState, PLAYER_STATES } from "../../../shared/game/Types"
import { WsMessage } from "../../../shared/messages"
import { createMoveMessage, createExitMessage } from "../../../shared/messages"

export class GameServerConnection {
    private boardState: CellState [][][] = [];
    private N: number;
    private ui: GameUI;
    private playerNames: string[] = [];
    private localPlayer!: LocalPlayer;
    private guestPlayer!: LocalPlayer;
    private localPlayerIndex: number = -1;
    private guestPlayerIndex: number = -1;
    private players: LocalPlayer[] = [];
    private currentPlayerIndex: number = 0;
    private nPlayers: number;
    private graphics: GameGraphics;
    private gameData: GameData;
    private gameID!: string;
    private ws: WebSocket;
    private onExit: () => void;

    constructor(gameData: GameData, ui: GameUI, graphics: GameGraphics, nPlayers: number, ws: WebSocket, onExit: () => void) {
        this.gameData = gameData;
        this.N = gameData.size;
        this.ui = ui;
        this.graphics = graphics;
        this.nPlayers = nPlayers;
        this.ws = ws;
        this.onExit = onExit;
        this.initBoard();
    }
    
    public async handleMessage(message: WsMessage) {
        console.log("Received message:", message);
        switch (message.type) {
            case "game-start":
                console.log(`Game ${message.payload.gameID} started`);
                this.playerNames = message.payload.playerNames;
                this.nPlayers = message.payload.nPlayers;
                if (this.playerNames[message.payload.youAre] === "guest")
                    this.guestPlayerIndex = message.payload.youAre;
                else
                    this.localPlayerIndex = message.payload.youAre;
                this.gameID = message.payload.gameID;
                break;
			
            case "turn":
                this.currentPlayerIndex = message.payload.playsNow;
                await this.ui.playerTitle(this.playerNames[message.payload.playsNow]);
                if (message.payload.playsNow === this.localPlayerIndex)
                    this.localPlayer.yourTurn(this.boardState, this.N, PLAYER_STATES[this.localPlayerIndex]);
                if (message.payload.playsNow === this.guestPlayerIndex)
                    this.guestPlayer.yourTurn(this.boardState, this.N, PLAYER_STATES[this.guestPlayerIndex]);
                break;
            
            case "move":
                this.graphics.placeSphere(message.payload.position, message.payload.player);
                this.boardState[message.payload.position.x][message.payload.position.y][message.payload.position.z] = message.payload.player;
                break;
            
            case "end":
                Object.assign(this.gameData, message.payload.gameData);
                this.graphics.hidePreview();
                if (message.payload.winningPos && this.gameData.winner) {
                    this.graphics.animateWin(message.payload.winningPos);
                    await this.ui.displayWinner(this.gameData.winner.username);
                } else {
                    this.ui.displayWinner("No one wins");
                }
                setTimeout(() => {this.onExit();}, 3000);
                break;
            
            default:
                console.log(`Unknown message: ${message}`);
        }
    } 

    public register(player: LocalPlayer): void {
        if (this.players.length >= this.nPlayers)
            throw new Error("Too many players were registered");
        if (player.name === "guest")
            this.guestPlayer = player;
        else
            this.localPlayer = player;
        this.players.push(player);
    }

    public placeMove(pos: GridPosition, IAm: LocalPlayer): boolean {
        if (IAm === this.localPlayer)
            this.ws.send(JSON.stringify(createMoveMessage(this.gameID, PLAYER_STATES[this.localPlayerIndex], this.localPlayerIndex, pos)));
        else if (IAm === this.guestPlayer)
            this.ws.send(JSON.stringify(createMoveMessage(this.gameID, PLAYER_STATES[this.guestPlayerIndex], this.guestPlayerIndex, pos)));
        return true;
    }

    public exitGame() {
        this.ws.send(JSON.stringify(createExitMessage(this.gameID, this.localPlayerIndex)));
        this.onExit();
    }

    public getCurrentPlayer(): LocalPlayer | null {
            if (this.currentPlayerIndex === this.localPlayerIndex)
                return this.localPlayer;
            else if (this.currentPlayerIndex === this.guestPlayerIndex)
                return this.guestPlayer;
            else
                return null;
    }

    public getCurrentPlayerState(): CellState {
        const state = PLAYER_STATES[this.currentPlayerIndex];

        if (state === undefined) {
            throw new Error("Current player has no CellState");
        }

        return state;
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
}