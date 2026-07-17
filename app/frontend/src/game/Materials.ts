import * as BABYLON from "@babylonjs/core";
import type { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { CellState } from "./Types";
import { playerStateToIndex } from "./Utils";


export class Materials {
    public readonly cube: StandardMaterial;

    public readonly playerMaterials: StandardMaterial[];
    public readonly previewMaterials: StandardMaterial[];

    constructor(scene: Scene) {
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

        light.intensity = 0.7;

        this.cube = new StandardMaterial("cubeMat", scene);
        this.cube.diffuseColor = new Color3(0.67, 0.7, 0.71);
        this.cube.alpha = 0.35;
        this.cube.needDepthPrePass = true;

        const playerColors: readonly Color3[] = [
            new Color3(1, 0.16, 0.01),  // Player 1: orange/red
            new Color3(0.01, 0.89, 1),  // Player 2: cyan
            new Color3(0.35, 1, 0.2),   // Player 3: green
            new Color3(0.9, 0.2, 1),    // Player 4: purple
        ];

        this.playerMaterials = playerColors.map((color, index) =>
                this.createPlayerMaterial(scene, `player${index + 1}Material`, color, 1));

        this.previewMaterials = playerColors.map((color, index) =>
                this.createPlayerMaterial(scene, `player${index + 1}PreviewMaterial`, color, 0.2));
    }

    public getPlayerMaterial(playerState: CellState): StandardMaterial {
        const index = playerStateToIndex(playerState);
        const material = this.playerMaterials[index];

        if (material === undefined) {
            throw new Error(
                `No permanent material for ${playerState}`
            );
        }

        return material;
    }

    public getPreviewMaterial(playerState: CellState): StandardMaterial {
        const index = playerStateToIndex(playerState);
        const material = this.previewMaterials[index];

        if (material === undefined) {
            throw new Error(
                `No preview material for ${playerState}`
            );
        }

        return material;
    }

    private createPlayerMaterial(scene: Scene, name: string, color: Color3, alpha: number): StandardMaterial {
        const material = new StandardMaterial(name, scene);

        material.diffuseColor = color.clone();
        material.alpha = alpha;

        if (alpha < 1) {
            material.needDepthPrePass = true;
        }

        return material;
    }
}