import { GameState } from "../../../backend/src/game/GameState"
import { Vector3} from "@babylonjs/core/Maths/math.vector";
import * as BABYLON from "@babylonjs/core";
import { Scene, Observer,PointerInfo } from "@babylonjs/core";
import type { GridPosition } from "../../../shared/game/Types"
import { Board } from "./Board"
import { CameraManager } from "./CameraManager"
import { Player } from "./Player";
import { LocalPlayer } from "./LocalPlayer";



export class InputManager {
    // private game: GameState;
    private scene: Scene;
    private mouse: Observer<PointerInfo> | null = null
    private board: Board;
    private camera: CameraManager;
    private players: Player[];

    constructor(/*game: GameState,*/player1: LocalPlayer, scene: Scene, board: Board, camera: CameraManager) {
        // this.game = game;
        this.scene = scene;
        this.board = board;
        this.camera = camera;
        this.players = [];
        this.players.push(player1);
    }

    public registerEvents(): void {
        window.addEventListener("keydown", this.handleKeyDown);
        this.mouse = this.scene.onPointerObservable.add(this.handleMouse,
            BABYLON.PointerEventTypes.POINTERTAP | BABYLON.PointerEventTypes.POINTERDOUBLETAP);

    }

    public unregisterEvents(): void {
        window.removeEventListener("keydown", this.handleKeyDown);
        if (this.mouse !== null) {
            this.scene.onPointerObservable.remove(this.mouse);
            this.mouse = null;
        }
    }

    private getClickedPos(pointerInfo: PointerInfo): Readonly<GridPosition> | null {
        const pickedMesh = pointerInfo.pickInfo?.pickedMesh;
        if (!pointerInfo.pickInfo?.hit || !pickedMesh)
            return null;
        const pos = pickedMesh.metadata ?.gridPosition as GridPosition | undefined;
        if (!pos)
            return null;
        return pos;
    }

    private handleMouse = (mouse: PointerInfo): void => {
        const pos = this.getClickedPos(mouse);
        if (pos === null)
            return;
        const player = this.players[0];//this.game.getCurrentPlayer();
        if (mouse.type === BABYLON.PointerEventTypes.POINTERTAP)
            player.selectPos(pos);
        else if (mouse.type === BABYLON.PointerEventTypes.POINTERDOUBLETAP) {
            if (player.selectPos(pos))
                player.choosePos();
        }

    }



    private handleKeyDown = (event: KeyboardEvent): void => {

        let cameraDir = new Vector3(0,0,0);
        const right = new Vector3(1,0,0);
        const left = new Vector3(-1,0,0);
        const up = new Vector3(0,1,0);
        const down = new Vector3(0,-1,0);
        const front = new Vector3(0,0,1);
        const back = new Vector3(0,0,-1);

        switch (event.key) {
            case "Enter":
                this.players[0].choosePos();
                break;

            case "1":
                this.board.toggleCubeSize();
                break;

            case "l":
                cameraDir = this.camera.getCameraDir(right);
                break;

            case "j":
                cameraDir = this.camera.getCameraDir(left);
                break;

            case "i":
                cameraDir = this.camera.getCameraDir(up);
                break;

            case "m":
                cameraDir = this.camera.getCameraDir(down);
                break;

            case "u":
                cameraDir = this.camera.getCameraDir(front);
                break;

            case "h":
                cameraDir = this.camera.getCameraDir(back);
                break;

            case "d":
                cameraDir = this.camera.getCameraDir(right);
                break;

            case "a":
                cameraDir = this.camera.getCameraDir(left);
                break;

            case "e":
                cameraDir = this.camera.getCameraDir(up);
                break;

            case "q":
                cameraDir = this.camera.getCameraDir(down);
                break;

            case "w":
                cameraDir = this.camera.getCameraDir(front);
                break;

            case "s":
                cameraDir = this.camera.getCameraDir(back);
                break;
        }

        if (cameraDir.equals(right))
            this.players[0].moveCursor(true, "x");
        else if (cameraDir.equals(left))
            this.players[0].moveCursor(false, "x");
        else if (cameraDir.equals(up))
            this.players[0].moveCursor(true, "y");
        else if (cameraDir.equals(down))
            this.players[0].moveCursor(false, "y");
        else if (cameraDir.equals(front))
            this.players[0].moveCursor(true, "z");
        else if (cameraDir.equals(back))
            this.players[0].moveCursor(false, "z");
    };
}
