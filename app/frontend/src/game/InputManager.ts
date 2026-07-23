import { GameState } from "./GameState"
import { Vector3} from "@babylonjs/core/Maths/math.vector";
import * as BABYLON from "@babylonjs/core";
import { Scene, Observer,PointerInfo } from "@babylonjs/core";
import type { GridPosition } from "./Types"
import { Board } from "./Board"
import { CameraManager } from "./CameraManager"



export class InputManager {
    private game: GameState;
    private scene: Scene;
    private mouse: Observer<PointerInfo> | null = null
    private board: Board;
    private camera: CameraManager;

    constructor(game: GameState, scene: Scene, board: Board, camera: CameraManager) {
        this.game = game;
        this.scene = scene;
        this.board = board;
        this.camera = camera;
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
        const player = this.game.getCurrentPlayer();
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
                this.game.getCurrentPlayer().choosePos();
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
        }

        if (cameraDir.equals(right))
            this.game.getCurrentPlayer().moveCursor(true, "x");
        else if (cameraDir.equals(left))
            this.game.getCurrentPlayer().moveCursor(false, "x");
        else if (cameraDir.equals(up))
            this.game.getCurrentPlayer().moveCursor(true, "y");
        else if (cameraDir.equals(down))
            this.game.getCurrentPlayer().moveCursor(false, "y");
        else if (cameraDir.equals(front))
            this.game.getCurrentPlayer().moveCursor(true, "z");
        else if (cameraDir.equals(back))
            this.game.getCurrentPlayer().moveCursor(false, "z");
    };
}
