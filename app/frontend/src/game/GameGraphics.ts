import * as BABYLON from "@babylonjs/core";
import { Board } from "./Board";
import { Materials } from "./Materials";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { GameState, CellState, type GridPosition } from "./GameState";
import { CameraManager } from "./CameraManager.ts";


export class GameGraphics {
    private cursor: GridPosition;
    private board: Board;
    private materials: Materials;
    private N: number;
    private game: GameState;
    private previewSphere: BABYLON.Mesh | null = null;
    private camera: CameraManager;

    constructor(board: Board, materials: Materials, N: number, game: GameState, camera: CameraManager)
    {
        this.board = board;
        this.materials = materials;
        this.N = N;
        this.game = game;
        this.camera = camera;
        this.cursor = {x: this.N -1, y: this.N - 1, z: this.N- 1};
        this.placePreview();
    }

    public moveCursor(direction: boolean, plane: string)
    {
        if (plane === "Enter")
        {
            this.placeSphere();
            return ;
        }
        switch (plane) {
            case "x":
                if (direction)
                    this.cursor.x = this.loopPlacement(this.cursor.x + 1);
                else
                    this.cursor.x = this.loopPlacement(this.cursor.x - 1);
                break;
            
            case "y":
                if (direction)
                    this.cursor.y = this.loopPlacement(this.cursor.y + 1);
                else
                    this.cursor.y = this.loopPlacement(this.cursor.y - 1);
                break;

            case "z":
                if (direction)
                    this.cursor.z = this.loopPlacement(this.cursor.z + 1);
                else
                    this.cursor.z = this.loopPlacement(this.cursor.z - 1);
                break;
        }
        if (this.previewSphere)
        {
            this.previewSphere.dispose();
            this.previewSphere = null;
        }
        this.placePreview();
    }

    public placeSphere() {
        let material: StandardMaterial = this.materials.Player1Mat
        if (this.game.getCurrentPlayer() === CellState.Player2)
            material = this.materials.Player2Mat;

        const success = this.game.placePiece(this.cursor);
        if (!success)
            return;
        this.board.putSphere(this.cursor, material);
        if (this.previewSphere)
        {
            this.previewSphere.dispose();
            this.previewSphere = null;
        }
        this.cursor = {x: this.N -1, y: this.N - 1, z: this.N- 1};
        this.placePreview();
    }

    public placePreview()  {
        let material: StandardMaterial = this.materials.PreivewPlayer1Mat;
        if (this.game.getCurrentPlayer() === CellState.Player2)
            material = this.materials.PreivewPlayer2Mat;

        let tries = 0;
        const maxTries = this.N * this.N * this.N; 
        while (!this.game.isCellEmpty(this.cursor) && tries < maxTries)
        {
            this.advanceCursor();
            tries++;
        }
        if (tries >= maxTries)
        {
            this.reset();
            return; // can only happen if board is full
        }
        this.previewSphere = this.board.putSphere(this.cursor, material);
    }

    private loopPlacement(cursor: number): number {
        if (cursor === this.N)
            return 0;
        else if (cursor < 0)
            return this.N - 1;
        else
            return cursor;
    }

    public reset() {
        this.board.reset();
        this.game.reset();
        this.camera.resetCamera();
        this.cursor = {x: this.N -1, y: this.N - 1, z: this.N- 1};
        this.placePreview();
    }

    private advanceCursor(): void {
    this.cursor.x--;

    if (this.cursor.x < 0) {
        this.cursor.x =  this.N - 1;
        this.cursor.y--;
    }

    if (this.cursor.y < 0) {
        this.cursor.y = this.N - 1;
        this.cursor.z--;
    }

    if (this.cursor.z < 0) {
        this.cursor.z = this.N - 1;
    }
}

}