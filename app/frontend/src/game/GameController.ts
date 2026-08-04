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
import { createJoinGameMessage } from "../../../shared/messages"

export class GameController {
    private boardState: CellState [][][] = [];
    private N: number;
    private ui: GameUI;
    private currentPlayerIndex: number = 0;
    private nPlayers: number;
    private moveCounter: number = 0;
    private graphics: GameGraphics;
    private gameData: GameData;

    constructor(gameData: GameData, ui: GameUI, graphics: GameGraphics, nPlayers: number) {
        this.gameData = gameData;
        this.N = gameData.size;
        this.ui = ui;
        this.graphics = graphics;
        this.nPlayers = nPlayers;
    }
    
    public getCurrentPlayerState(): CellState {
        const state = PLAYER_STATES[this.currentPlayerIndex];

        if (state === undefined) {
            throw new Error("Current player has no CellState");
        }

        return state;
    }
}