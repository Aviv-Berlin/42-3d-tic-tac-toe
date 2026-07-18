import { GameState } from "./GameState"
import * as BABYLON from "@babylonjs/core";
import { Scene, Observer,PointerInfo } from "@babylonjs/core";
import type { GridPosition } from "./Types"
import { Board } from "./Board"


export class InputManager {
    private game: GameState;
    private scene: Scene;
    private mouse: Observer<PointerInfo> | null = null
    private board: Board;

    constructor(game: GameState, scene: Scene, board: Board) {
        this.game = game;
        this.scene = scene;
        this.board = board;
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

        switch (event.key) {
            case "q":
                this.game.getCurrentPlayer().moveCursor(true, "y");
                break;

            case "a":
                this.game.getCurrentPlayer().moveCursor(false, "y");
                break;

            case "w":
                this.game.getCurrentPlayer().moveCursor(true, "z");
                break;

            case "s":
                this.game.getCurrentPlayer().moveCursor(false, "z");
                break;

            case "e":
                this.game.getCurrentPlayer().moveCursor(true, "x");
                break;

            case "d":
                this.game.getCurrentPlayer().moveCursor(false, "x");
                break;

            case "Enter":
                this.game.getCurrentPlayer().choosePos();
                break;
            
            case "1":
                this.board.toggleCubeSize();
        }
    };
}






    
