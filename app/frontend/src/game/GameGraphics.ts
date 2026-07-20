import * as BABYLON from "@babylonjs/core";
import { Board } from "./Board";
import { Materials } from "./Materials";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CellState, type GridPosition } from "./Types";
import { CameraManager } from "./CameraManager";


export class GameGraphics {
    private board: Board;
    private materials: Materials;
    private previewSphere: BABYLON.Mesh | null = null;
    private camera: CameraManager;

    constructor(board: Board, materials: Materials, camera: CameraManager) {
        this.board = board;
        this.materials = materials;
        this.camera = camera;
    }

    public showPreview(pos: GridPosition, player: CellState): void {
        this.hidePreview();

        const material = this.materials.getPreviewMaterial(player);
        this.previewSphere = this.board.putSphere(pos,material, false);
    }

    public hidePreview(): void {
        if (!this.previewSphere)
            return;

        this.previewSphere.dispose();
        this.previewSphere = null;
    }

    public placeSphere(pos: GridPosition, player: CellState): void {
        this.hidePreview();
        const material = this.materials.getPlayerMaterial(player);
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
<<<<<<< HEAD
}
=======

    if (this.cursor.y < 0) {
        this.cursor.y = this.N - 1;
        this.cursor.z--;
    }

    if (this.cursor.z < 0) {
        this.cursor.z = this.N - 1;
    }
}

}
>>>>>>> e30127e (Start fix components signatures with types)
