import * as BABYLON from "@babylonjs/core";
import { Board } from "./Board";
import { Materials } from "./Materials";
import { Material } from "@babylonjs/core/Materials/material";

export class PlacementManager {
    private cursorX = 0;
    private cursorY = 0;
    private cursorZ = 0;
    private currentPlayer = 1;
    private board: Board;
    private materials: Materials;
    private N: number;
    private currentSphere: BABYLON.Mesh | null = null;

    constructor(_board: Board, _materials: Materials, _N: number)
    {
        this.board = _board;
        this.materials = _materials;
        this.N = _N;
        this.cursorX = this.N - 1;
        this.cursorY = this.N - 1;
        this.cursorZ = this.N - 1;
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
                    this.cursorX++;
                else
                    this.cursorX--;
                break;
            
            case "y":
                if (direction)
                    this.cursorY++;
                else
                    this.cursorY--;
                break;

            case "z":
                if (direction)
                    this.cursorZ++;
                else
                    this.cursorZ--;
                break;
        }
        if (this.currentSphere)
        {
            this.currentSphere.dispose();
            this.currentSphere = null;
        }
        this.placePreview();
    }

    public placeSphere() {
        const material = this.getCurrentPlayerMaterial(false);
        this.board.putSphere(this.cursorX, this.cursorY, this.cursorZ, material);
        this.switchPlayer();

    }

    public placePreview()  {
        const material = this.getCurrentPlayerMaterial(true);
        this.currentSphere = this.board.putSphere(this.cursorX, this.cursorY, this.cursorZ, material);
    }

    private getCurrentPlayerMaterial(preview: boolean): Material {
        if (preview)
        {
            if (this.currentPlayer === 1)
                return this.materials.PreivewPlayer1Mat;
            else
                return this.materials.PreivewPlayer2Mat;
        }
        else
        {
            if (this.currentPlayer === 1)
                return this.materials.Player1Mat;
            else
                return this.materials.Player2Mat;
        }
    }

    private switchPlayer(): void {
        if (this.currentPlayer === 1)
            this.currentPlayer = 2;
        else
            this.currentPlayer = 1;
    }
}