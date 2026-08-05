import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
import { Board } from "./Board";
import { GameUI } from "./GameUI";
import { GameState } from "../../../backend/src/game/GameState";
import { InputManager } from "./InputManager";
import { GameGraphics } from "./GameGraphics";
import { CameraManager } from "./CameraManager";
import { Player } from "./Player"
import { AiPlayer } from "../../../backend/src/game/AIPlayer"
import { LocalPlayer } from "./LocalPlayer"
import { GameData } from "../../../shared/game";
import { GridPosition, CellState, PLAYER_STATES } from "../../../shared/game/Types"
import { WsMessage } from "../../../shared/messages"
import { handleMessage } from "./socketHandlersFE";
import { createJoinGameMessage, createMoveMessage } from "../../../shared/messages"

export class GameController {
    private boardState: CellState [][][] = [];
    private N: number;
    private ui: GameUI;
    private playerNames: string[] = [];
    private players: Player[] = [];
    private currentPlayerIndex: number = 0;
    private nPlayers: number;
    private graphics: GameGraphics;
    private gameData: GameData;
    private localPlayerIndex: number = 0;
    private gameID!: string;

    constructor(gameData: GameData, ui: GameUI, graphics: GameGraphics, nPlayers: number) {
        this.gameData = gameData;
        this.N = gameData.size;
        this.ui = ui;
        this.graphics = graphics;
        this.nPlayers = nPlayers;
        this.initBoard();
    }
    
    public handleMessage(message: WsMessage) {
        console.log(`Received message: ${message}`);
        switch (message.type) {
            case "game-start":
                console.log(`Game ${message.payload.gameID} started`);
                this.playerNames = message.payload.playerNames;
                this.nPlayers = message.payload.nPlayers;
                this.currentPlayerIndex = message.payload.firstPlayer;
                this.localPlayerIndex = message.payload.youAre;
                this.gameID = message.payload.gameID;
                break;
			case "your-turn":
				console.log('It\'s your turn');
            case "move":
                this.graphics.placeSphere(message.payload.position, message.payload.player);
                this.boardState[message.payload.position.x][message.payload.position.y][message.payload.position.z] = message.payload.player;
                this.switchPlayer();
                break;
            default:
                console.log(`Unknown message: ${message}`);
        }
    }
    
    private async switchPlayer(): Promise<void> {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

        await this.ui.playerTitle(this.playerNames[this.currentPlayerIndex]);
        if (this.currentPlayerIndex === this.localPlayerIndex)
            this.players[0].yourTurn(this.boardState, this.N, PLAYER_STATES[this.localPlayerIndex]);
    }

    public register(player: Player): void {
        if (this.players.length >= this.nPlayers)
            throw new Error("Too many players were registered");
        this.players.push(player);
    }

    private startGame(message: WsMessage) {
        if (this.currentPlayerIndex === this.localPlayerIndex)
            this.players[0].yourTurn(this.boardState, this.N, PLAYER_STATES[this.localPlayerIndex]);
    }


    public placeMove(pos: GridPosition): boolean {
        createMoveMessage(this.gameID, PLAYER_STATES[this.currentPlayerIndex], pos);
        return true;
    }

    public getCurrentPlayer(): Player | null {
            if (this.currentPlayerIndex === this.localPlayerIndex)
                return this.players[0];
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