import * as BABYLON from "@babylonjs/core";
import { Board } from "./Board";
import { Materials } from "./Materials";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { GameState, CellState, type GridPosition } from "./GameState";
import { CameraManager } from "./CameraManager.ts";


export class GameGraphics {
    private board: Board;
    private materials: Materials;
    private previewSphere: BABYLON.Mesh | null = null;
    private camera: CameraManager;

    constructor(
        board: Board,
        materials: Materials,
        camera: CameraManager
    ) {
        this.board = board;
        this.materials = materials;
        this.camera = camera;
    }

    public showPreview(pos: GridPosition, player: CellState): void {
        this.hidePreview();

        const material =
            player === CellState.Player1
                ? this.materials.PreivewPlayer1Mat
                : this.materials.PreivewPlayer2Mat;

        this.previewSphere = this.board.putSphere(pos,material, false);
    }

    public hidePreview(): void {
        if (!this.previewSphere)
            return;

        this.previewSphere.dispose();
        this.previewSphere = null;
    }

    public placeMove(pos: GridPosition, player: CellState): void {
        this.hidePreview();

        const material =
            player === CellState.Player1
                ? this.materials.Player1Mat
                : this.materials.Player2Mat;

        this.board.putSphere(pos, material, true);
    }

    public resetVisuals(): void {
        this.hidePreview();
        this.board.reset();
        this.camera.resetCamera();
    }

    public animateWin(winningPositions: GridPosition[]): void {
        for (const position of winningPositions) {
            const sphere = this.board.getSphere(position);

            if (sphere)
                sphere.scaling.setAll(1.3);
        }
    }
}