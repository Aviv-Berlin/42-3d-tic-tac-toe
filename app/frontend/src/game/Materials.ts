import * as BABYLON from "@babylonjs/core";
import type { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { CellState } from "./Types";
import { playerStateToIndex } from "./Utils";


export class Materials {
    
    public readonly cube: StandardMaterial;
    public readonly playerMaterials: StandardMaterial[];
    public readonly previewMaterials: StandardMaterial[];
    private readonly cubeColor = new Color3(0.67, 0.7, 0.71);
    private cubeEdgeColor = new Color4(1, 1, 1, 1);
    private sceneBackground = new Color4(0.2, 0.2, 0.2, 1);
    private readonly cubeAlpha = 0;
    private readonly textColor = Color3.White();
    private readonly textFont = "Futura, Arial, sans-serif";
    private scene: Scene;
    private looks: number = 1;

    constructor(scene: Scene) {
        this.scene = scene;
        scene.clearColor = this.sceneBackground;
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        this.cube = new StandardMaterial("cubeMat", scene);
        this.cube.diffuseColor = this.cubeColor.clone();
        this.cube.alpha = this.cubeAlpha;
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

    public applyCubeEdges(mesh: BABYLON.AbstractMesh): void {
        mesh.enableEdgesRendering();
        mesh.edgesWidth = 5.0;
        mesh.edgesColor = this.cubeEdgeColor;
    }
    
    public toggleLook(): void {
        this.looks = (this.looks % 4) + 1;
        switch (this.looks) {
            case 1:
                this.scene.clearColor = new Color4(1,1,1,1); 
                break;

            case 2:
                this.scene.clearColor =  new Color4(0,0,0,1);
                break;

            case 3:
                this.scene.clearColor =  new Color4(0.2,0.2,0.2,1);
                break;

            case 3:
                this.scene.clearColor =  new Color4(0,1,1,1);
                break;
            
            default:
                this.scene.clearColor = new Color4(0,0,1,1); 
                break;
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
            material.needDepthPrePass = true;
        }
        return material;
    }

    public createTextCubeMaterial(id: string, text: string): StandardMaterial {
        const textureSize = 512;
        const texture = new BABYLON.DynamicTexture(`${id}Texture`,
            { width: textureSize, height: textureSize}, this.scene, true);
        texture.hasAlpha = true;
        const context = texture.getContext() as CanvasRenderingContext2D;
        // Same background color and transparency as the board cubes.
        context.fillStyle = this.colorToCss(this.cubeColor, 1);
        context.fillRect(0, 0, textureSize, textureSize);
        const maxTextWidth = textureSize * 0.72;
        const maximumFontSize = 340;
        const minimumFontSize = 40;
        let fontSize = maximumFontSize;
        while (fontSize > minimumFontSize) {
            context.font =`bold ${fontSize}px ${this.textFont}`;
            const textWidth = context.measureText(text).width;
            if (textWidth <= maxTextWidth)
                break;
            fontSize -= 10;
        }

        context.font = `bold ${fontSize}px ${this.textFont}`;
        context.fillStyle = this.colorToCss(this.textColor, 1);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, textureSize / 2, textureSize / 2);
        texture.update();
        const material = new StandardMaterial(`${id}Material`, this.scene);
        material.diffuseColor = new Color3(1,1,1);
        material.diffuseTexture = texture;
        // Use the canvas transparency:
        // translucent background, opaque text.
        material.useAlphaFromDiffuseTexture = true;
        material.needDepthPrePass = true;
        return material;
    }

    private colorToCss(color: Color3, alpha: number): string {
        const red = Math.round(color.r * 255);
        const green = Math.round(color.g * 255);
        const blue = Math.round(color.b * 255);
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

}