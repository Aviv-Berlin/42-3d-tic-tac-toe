import * as BABYLON from "@babylonjs/core";
import type { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { CellState } from "../../../shared/game/Types";
import { playerStateToIndex } from "../../../shared/game/Utils";
import { LOOKS, Look, DEFAULT_PLAYER_COLORS} from "./LookSetting"


export class Materials {
    
    public readonly cube: StandardMaterial;
    public readonly buttonCube: StandardMaterial;
    public readonly playerMaterials: StandardMaterial[];
    public readonly previewMaterials: StandardMaterial[];
    private currentLookIndex = 0;
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        const look = this.getLook();
        scene.clearColor = look.backgroundColor.clone();
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        this.cube = new StandardMaterial("cubeMat", scene);
        this.cube.diffuseColor = look.cubeColor.clone();
        this.cube.alpha = look.cubeAlpha;
        this.cube.needDepthPrePass = false;
        this.cube.disableDepthWrite = true;

        this.buttonCube = new StandardMaterial("buttonCube", scene);
        this.buttonCube.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.buttonCube.alpha = 1;

        const playerColors = this.getPlayerColors();
        this.playerMaterials = playerColors.map((color, index) =>
                this.createPlayerMaterial(`player${index + 1}Material`, color, 1));
        this.previewMaterials = playerColors.map((color, index) =>
                this.createPlayerMaterial(`player${index + 1}PreviewMaterial`, color, look.previewAlpha));
    }

    public applyCubeEdges(mesh: BABYLON.AbstractMesh): void {
        const look = this.getLook();
        mesh.enableEdgesRendering();
        mesh.edgesWidth = look.edgeWidth;
        mesh.edgesColor = look.edgeColor.clone();
    }
    
    

    public applyLook(index: number): void {
        const look = LOOKS[index];

        if (!look)
            throw new Error(`Unknown look index: ${index}`);
        
        this.currentLookIndex = index;
        this.scene.clearColor.copyFrom(look.backgroundColor);
        this.cube.diffuseColor.copyFrom(look.cubeColor);
        this.cube.alpha = look.cubeAlpha;

        const playerColors = this.getPlayerColors();
        for (let i = 0; i < playerColors.length; i++) {
            this.playerMaterials[i]?.diffuseColor.copyFrom(playerColors[i]);
            this.previewMaterials[i]?.diffuseColor.copyFrom(playerColors[i]);
            this.previewMaterials[i].alpha = look.previewAlpha;
        }
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

    private createPlayerMaterial(name: string, color: Color3, alpha: number): StandardMaterial {
        const material = new StandardMaterial(name, this.scene);
        material.diffuseColor = color.clone();
        material.alpha = alpha;
        if (alpha < 1) {
            material.needDepthPrePass = false;
            material.disableDepthWrite = true;
        }
        return material;
    }





    public getLook(): Look {
        return LOOKS[this.currentLookIndex];
    }

    public getLookIndex(): number {
        return this.currentLookIndex;
    }

    private getPlayerColors(): readonly Color3[] {
        return this.getLook().playerColors ?? DEFAULT_PLAYER_COLORS;
    }
}