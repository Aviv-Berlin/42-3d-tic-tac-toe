import * as BABYLON from "@babylonjs/core";
import type { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { CellState } from "../../../shared/game/Types";
import { playerStateToIndex } from "../../../shared/game/Utils";


export interface Look {
    backgroundColor: BABYLON.Color4;
    cubeColor: BABYLON.Color3;
    cubeAlpha: number;
    edgeColor: BABYLON.Color4;
    textColor: BABYLON.Color3;
}

export class Materials {
    
    public readonly cube: StandardMaterial;
    public readonly buttonCube: StandardMaterial;
    public readonly playerMaterials: StandardMaterial[];
    public readonly previewMaterials: StandardMaterial[];
    private currentLook: Look = {
        backgroundColor: new Color4(0.33, 0.30, 0.35, 1),
        cubeColor: new Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0.4,
        edgeColor: new Color4(1, 1, 1, 1),
        textColor: new Color3(0.85, 0.85, 0.85),
    };
    private readonly cubeColor = new Color3(0.67, 0.7, 0.71);
    private cubeEdgeColor = new Color4(1, 1, 1, 1);
    private sceneBackground = new Color4(0.33, 0.30, 0.35, 1);
    private cubeAlpha = 0.4;
    private readonly defaultTextColor = new Color3(0.85,0.85,0.85);
    private textColor = this.defaultTextColor.clone();
    private readonly textFont = "Futura, Arial, sans-serif";
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        scene.clearColor = this.sceneBackground;
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        this.cube = new StandardMaterial("cubeMat", scene);
        this.cube.diffuseColor = this.cubeColor.clone();
        this.cube.alpha = this.cubeAlpha;
        this.cube.needDepthPrePass = false;
        this.cube.disableDepthWrite = true;

        this.buttonCube = new StandardMaterial("buttonCube", scene);
        this.buttonCube.diffuseColor = new BABYLON.Color3(0, 0, 0);
        this.buttonCube.alpha = 1;

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

    public applyCubeEdges(mesh: BABYLON.AbstractMesh): void {
        mesh.enableEdgesRendering();
        mesh.edgesWidth = 2.0;
        mesh.edgesColor = this.cubeEdgeColor;
    }
    
    

    public applyLook(look: number): boolean {
        switch (look) {
            case 1:
                this.scene.clearColor = new Color4(1, 1, 1, 1);
                this.cubeEdgeColor = new Color4(0, 0, 0, 1);
                this.cube.alpha = 0;
                this.cube.needDepthPrePass = false;
                this.cube.disableDepthWrite = true;
                this.textColor = new Color3(0,0,0);
                return true;

            case 2:
                this.scene.clearColor = new Color4(0, 0, 0, 1);
                this.cubeEdgeColor = new Color4(1, 1, 1, 1);
                this.cube.alpha = 0;
                this.cube.needDepthPrePass = false;
                this.cube.disableDepthWrite = true;
                this.textColor = new Color3(1,1,1);
                return true;

            case 3:
                this.scene.clearColor = new Color4(0.4, 0.4, 1, 1);
                this.cube.alpha = 0.12;
                this.cube.needDepthPrePass = false;
                this.cube.disableDepthWrite = true;
                this.textColor = new Color3(1,1,0);
                return false;

            case 4:
                this.scene.clearColor = this.sceneBackground.clone();
                this.cube.diffuseColor = this.cubeColor.clone();
                this.cube.alpha = 0.4;
                this.cube.needDepthPrePass = false;
                this.cube.disableDepthWrite = true;
                this.textColor = this.defaultTextColor.clone();
                return false;

            case 5:
                this.scene.clearColor = this.sceneBackground.clone();
                this.cube.diffuseColor = this.cubeColor.clone();
                this.cube.alpha = 0.4;
                this.cube.needDepthPrePass = false;
                this.cube.disableDepthWrite = true;
                this.textColor = this.defaultTextColor.clone();
                return false;
            
            case 6:
                this.scene.clearColor = this.sceneBackground.clone();
                this.cube.diffuseColor = this.cubeColor.clone();
                this.cube.alpha = 0.4;
                this.cube.needDepthPrePass = false;
                this.cube.disableDepthWrite = true;
                this.textColor = this.defaultTextColor.clone();
                return false;
            
            case 7:
                // Same values used when Materials is constructed.
                this.scene.clearColor = this.sceneBackground.clone();
                this.cube.diffuseColor = this.cubeColor.clone();
                this.cube.alpha = 0.4;
                this.cube.needDepthPrePass = false;
                this.cube.disableDepthWrite = true;
                this.textColor = this.defaultTextColor.clone();
                return false;

            default:
                throw new Error(`Unknown look: ${look}`);
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

    private createPlayerMaterial(scene: Scene, name: string, color: Color3, alpha: number): StandardMaterial {
        const material = new StandardMaterial(name, this.scene);
        material.diffuseColor = color.clone();
        material.alpha = alpha;
        if (alpha < 1) {
            material.needDepthPrePass = false;
            material.disableDepthWrite = true;
        }
        return material;
    }

    private drawTextCubeTexture(texture: BABYLON.DynamicTexture, text: string, cubeColor: Color3, cubeOpacity: number = 1, textOpacity: number = 1): void {
        const textureSize = 512;
        const context = texture.getContext() as CanvasRenderingContext2D;
        context.clearRect(0, 0, textureSize, textureSize);
        // Cube background follows the current board-cube alpha.
        context.fillStyle = this.colorToCss(cubeColor, cubeOpacity);
        context.fillRect(0, 0, textureSize, textureSize);
        const maxTextWidth = textureSize * 0.72;
        const maximumFontSize = 340;
        const minimumFontSize = 40;
        let fontSize = maximumFontSize;
        while (fontSize > minimumFontSize) {
            context.font = `bold ${fontSize}px ${this.textFont}`;
            if (context.measureText(text).width <= maxTextWidth)
                break;
            fontSize -= 10;
        }

        context.font = `bold ${fontSize}px ${this.textFont}`;
        context.fillStyle = this.colorToCss(this.textColor, textOpacity);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, textureSize / 2, textureSize / 2);
        texture.update();
    }

    public createTextCubeMaterial(id: string, text: string, cubeColor: Color3, cubeOpacity: number = 1, textOpacity: number = 1): StandardMaterial {
        const textureSize = 512;
        const texture = new BABYLON.DynamicTexture(`${id}Texture`,
            { width: textureSize, height: textureSize }, this.scene, true);
        texture.hasAlpha = true;
        this.drawTextCubeTexture(texture, text, cubeColor, cubeOpacity, textOpacity);
        const material = new StandardMaterial(`${id}Material`, this.scene);
        material.diffuseColor = Color3.White();
        material.diffuseTexture = texture;
        material.useAlphaFromDiffuseTexture = true;
        material.needDepthPrePass = true;
        return material;
    }

    public getCubeColor(): Color3 {
        return this.cube.diffuseColor.clone();
    }

    private colorToCss(color: Color3, alpha: number): string {
        const red = Math.round(color.r * 255);
        const green = Math.round(color.g * 255);
        const blue = Math.round(color.b * 255);
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    public applyTextCubeLook(mesh: BABYLON.AbstractMesh, renderEdges: boolean): void {
        const multiMaterial = mesh.material;
        if (!(multiMaterial instanceof BABYLON.MultiMaterial))
            return;
        if (renderEdges)
            this.applyCubeEdges(mesh);
        else
            mesh.disableEdgesRendering();
    }

    public createPlainCubeMaterial(id: string): StandardMaterial {
        const material = new StandardMaterial(id, this.scene);
        material.diffuseColor = this.cube.diffuseColor.clone();
        material.alpha = this.cube.alpha;
        material.needDepthPrePass = true;
        return material;
    }

    public getLook(): Look {
        return this.currentLook;
    }

}