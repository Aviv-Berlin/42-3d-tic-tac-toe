import { GameUI } from "./GameUI";
import { LocalPlayer } from "./LocalPlayer"
import { GameData } from "../../../shared/game";
import { GridPosition, CellState, PLAYER_STATES } from "../../../shared/game/Types"
import { WsMessage } from "../../../shared/messages"
import { createMoveMessage, CreateExitMessage } from "../../../shared/messages"
import { Board } from "./Board"
import game from "../services/game";
import { setGameData } from "../store/gameData";

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
    private currentPlayerIndex: number = -1;
    private nPlayers: number;
    private board: Board;
    private gameData: GameData;
    private gameID!: string;
    private ws: WebSocket;
    private onExit: () => void;

    constructor(gameData: GameData, ui: GameUI, board: Board, nPlayers: number, ws: WebSocket, onExit: () => void) {
        this.gameData = gameData;
        this.N = gameData.size;
        this.ui = ui;
        this.board = board;
        this.nPlayers = nPlayers;
        this.ws = ws;
        this.onExit = onExit;
        this.initBoard();
    }

    public async handleMessage(message: WsMessage) {

        console.log("Received message:", message);
        switch (message.type) {
            case "game-start":
                console.log("GAME START");
                console.log("youAre:", message.payload.youAre);
                console.log("playerNames:", message.payload.playerNames);
                console.log("playerNames[0]:", message.payload.playerNames[0]);
                console.log("playerNames[1]:", message.payload.playerNames[1])
                this.playerNames = message.payload.playerNames;
                this.nPlayers = message.payload.nPlayers;
                this.localPlayerIndex = message.payload.youAre;
                this.guestPlayerIndex = this.playerNames.findIndex(name => name === "guest");
                this.gameID = message.payload.gameID;
                break;

            case "turn":
                console.log("TURN", { playsNow: message.payload.playsNow,  localPlayerIndex: this.localPlayerIndex,
                    isMyTurn: message.payload.playsNow === this.localPlayerIndex, guestPlayerIndex: this.guestPlayerIndex, isGuestTurn: message.payload.playsNow === this.guestPlayerIndex});
                this.currentPlayerIndex = message.payload.playsNow;
                await this.ui.playerTitle(this.playerNames[message.payload.playsNow]);
                if (message.payload.playsNow === this.localPlayerIndex)
                    this.localPlayer.yourTurn(this.boardState, this.N, PLAYER_STATES[this.localPlayerIndex]);
                else if (message.payload.playsNow === this.guestPlayerIndex)
                    this.guestPlayer.yourTurn(this.boardState, this.N, PLAYER_STATES[this.guestPlayerIndex]);
                else
                    this.board.hidePreview();
                break;

            case "move":
                this.board.hidePreview();
                this.board.placeMoveMesh(message.payload.position, message.payload.player, false);
                this.boardState[message.payload.position.x][message.payload.position.y][message.payload.position.z] = message.payload.player;
                break;

            case "end":
                Object.assign(this.gameData, message.payload.gameData);
                this.board.hidePreview();
                if (message.payload.winningPos && this.gameData.winner) {
                    this.board.animateWin(message.payload.winningPos);
                    await this.ui.displayWinner(this.gameData.winner.username, "WINS!");
                }
                else if (message.payload.whoExited !== -1) {
                    await this.ui.displayWinner(this.playerNames[message.payload.whoExited], "left game");
                } else {
                    await this.ui.displayWinner("No one", "wins");
                }
                setTimeout(() => {this.onExit();}, 3000);
                break;

			case "game-state":
    			const state = message.payload;
				
				this.boardState = state.boardState;
    			this.playerNames = state.playerNames;
    			this.localPlayerIndex = state.localPlayerIndex;
    			this.guestPlayerIndex = state.guestPlayerIndex;
    			this.currentPlayerIndex = state.currentPlayerIndex;
    			this.gameData = state.gameData;
				setGameData(this.gameData);
				console.log("GameData:", this.gameData);

    			// restore board 
    			this.renderBoard();

				// restore end of game
				if (this.gameData.isFinished){
					this.restoreEnd();
					break;
				}
			
    			// Restore whose turn it is
    			this.restoreTurn();
				break;

            default:
                console.log(`Unknown message: ${message}`);
        }
    }

	public renderBoard(){
		for (let x = 0; x < this.N; x++) {
    			    for (let y = 0; y < this.N; y++) {
    			        for (let z = 0; z < this.N; z++) {
    			            const player = this.boardState[x][y][z];
						
    			            if (player !== CellState.Empty) {
    			                this.board.placeMoveMesh(
    			                    { x, y, z },
    			                    player,
    			                    false
    			                );
    			            }
    			        }
    			    }
    			}
	}

	public async restoreEnd(){
                this.board.hidePreview();
                if (this.gameData.winner) {
                    await this.ui.displayWinner(this.gameData.winner.username, "WINS!");
                }

                else if (this.gameData.endMessage) {
    				const whoLeft = this.playerNames.find(name =>
        			this.gameData.endMessage?.startsWith(`${name} has left the game`)
    				);
					if (whoLeft){
						await this.ui.displayWinner(whoLeft, "left game");
					}
				}
				else {
                    await this.ui.displayWinner("No one", "wins");
                }
                setTimeout(() => {this.onExit();}, 3000);
	}

	public async restoreTurn(){
		await this.ui.playerTitle(this.playerNames[this.currentPlayerIndex]);
                if (this.currentPlayerIndex === this.localPlayerIndex)
                    this.localPlayer.yourTurn(this.boardState, this.N, PLAYER_STATES[this.localPlayerIndex]);
                else if (this.currentPlayerIndex === this.guestPlayerIndex)
                    this.guestPlayer.yourTurn(this.boardState, this.N, PLAYER_STATES[this.guestPlayerIndex]);
                else
                    this.board.hidePreview();
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
        this.ws.send(JSON.stringify(CreateExitMessage(this.gameID, this.localPlayerIndex)));
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
