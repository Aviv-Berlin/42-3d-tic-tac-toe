import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";

export interface TextCubeOptions {
    name?: string;
    size?: number;
    letterFace?: number;
    renderEdges?: boolean;
    alwaysOnTop?: boolean;
    onClick?: () => void;
    cubeColor?: BABYLON.Color3;
    cubeAlpha?: number;
    textColor?: BABYLON.Color3;
    textAlpha?: number;
    ignoreLighting?: boolean;
}

interface TextCubeData {
    mesh: BABYLON.Mesh;
    text: string;
    options: TextCubeOptions;
}

export class TextCubeFactory {

    private readonly scene: BABYLON.Scene;
    private readonly materials: Materials;
    private readonly textFont = "Futura, Arial, sans-serif";
    private textCubes: TextCubeData[] = [];

    constructor(scene: BABYLON.Scene, materials: Materials) {
        this.scene = scene;
        this.materials = materials;
    }

    public createTextCube(text: string, options: TextCubeOptions = {}): BABYLON.Mesh {
        const name = options.name ?? `textCube-${text}`;
        const size = options.size ?? 2;
        const cube = BABYLON.MeshBuilder.CreateBox(name, { size }, this.scene);
        const style = this.getStyle(options);
        const plainMaterial = this.createPlainMaterial(`${name}PlainMaterial`,
                style.cubeColor, style.cubeAlpha, style.ignoreLighting);
        const multiMaterial = new BABYLON.MultiMaterial(`${name}MultiMaterial`, this.scene);
        multiMaterial.subMaterials = [plainMaterial];
        const materialIndexes = new Array(6).fill(0);

        if (text !== "") {
            const textMaterial = this.createTextMaterial(`${name}TextMaterial`, text, style.cubeColor,
                style.cubeAlpha, style.textColor, style.textAlpha, style.ignoreLighting);
            multiMaterial.subMaterials.push(textMaterial);
            const letterFace = options.letterFace ?? 1;
            if (letterFace === 6)
                materialIndexes.fill(1);
            else
                materialIndexes[letterFace] = 1;
        }

        cube.material = multiMaterial;
        this.createFaceSubMeshes(cube,materialIndexes);
        this.applyEdges(cube, options.renderEdges ?? this.materials.getLook().renderEdges);
        if (options.alwaysOnTop) {
            cube.renderingGroupId = 2;
            multiMaterial.depthFunction = BABYLON.Constants.ALWAYS;
            multiMaterial.disableDepthWrite = true;
        }
        this.configurePicking(cube, options.onClick);
        this.textCubes.push({mesh: cube, text, options});
        return cube;
    }

    private getStyle(options: TextCubeOptions) {
        const look = this.materials.getLook();
        return {cubeColor: options.cubeColor ?? look.textCubeColor ?? look.cubeColor,
                cubeAlpha: options.cubeAlpha ?? look.textCubeAlpha ?? look.cubeAlpha,
                textColor: options.textColor ?? look.textColor,
                textAlpha: options.textAlpha ?? 1,
                ignoreLighting: options.ignoreLighting ?? false };
    }

    private createPlainMaterial(name: string, color: BABYLON.Color3, alpha: number, ignoreLighting: boolean): BABYLON.StandardMaterial {
        const material = new BABYLON.StandardMaterial(name, this.scene);
        material.diffuseColor = color.clone();
        material.alpha = alpha;
        material.disableLighting = ignoreLighting;
        if (alpha < 1) {
            material.needDepthPrePass = true;
            material.disableDepthWrite = true;
        }
        return material;
    }

    private createTextMaterial(name: string, text: string, cubeColor: BABYLON.Color3, cubeAlpha: number,
        textColor: BABYLON.Color3, textAlpha: number, ignoreLighting: boolean): BABYLON.StandardMaterial {
        const textureSize = 512;
        const texture = new BABYLON.DynamicTexture(`${name}Texture`, {
                width: textureSize, height: textureSize }, this.scene, true);
        texture.hasAlpha = true;
        this.drawTextTexture(texture, text, cubeColor, cubeAlpha, textColor, textAlpha);
        const material = new BABYLON.StandardMaterial(name, this.scene);
        material.diffuseTexture = texture;
        material.diffuseColor = BABYLON.Color3.White();
        material.useAlphaFromDiffuseTexture = true;
        material.disableLighting = ignoreLighting;
        material.needDepthPrePass = true;
        return material;
    }


    private drawTextTexture(texture: BABYLON.DynamicTexture, text: string, cubeColor: BABYLON.Color3,
        cubeAlpha: number, textColor: BABYLON.Color3, textAlpha: number): void {
        const textureSize = 512;
        const context = texture.getContext() as CanvasRenderingContext2D;
        context.clearRect(0, 0, textureSize, textureSize);
       // cube background
        context.fillStyle = this.colorToCss(cubeColor, cubeAlpha);
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
        context.fillStyle = this.colorToCss(textColor, textAlpha);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, textureSize / 2, textureSize / 2);
        texture.update();
    }


    private createFaceSubMeshes(cube: BABYLON.Mesh, materialIndexes: number[]): void {
        cube.subMeshes = [];
        const vertexCount = cube.getTotalVertices();
        for (let face = 0; face < 6; face++) {
            new BABYLON.SubMesh(materialIndexes[face], 0, vertexCount, face * 6, 6, cube);
        }
    }

    private applyEdges(cube: BABYLON.Mesh, renderEdges: boolean): void {
        if (renderEdges)
            this.materials.applyCubeEdges(cube);
        else
            cube.disableEdgesRendering();
    }

    private colorToCss(color: BABYLON.Color3, alpha: number): string {
        const red = Math.round(color.r * 255);
        const green = Math.round(color.g * 255);
        const blue = Math.round(color.b * 255);
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    private configurePicking(cube: BABYLON.Mesh, onClick?: () => void): void {
        if (!onClick) {
            cube.isPickable = false;
            return;
        }
        cube.isPickable = true;
        cube.actionManager = new BABYLON.ActionManager(this.scene);
        cube.actionManager.hoverCursor =  "pointer";
        cube.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,onClick));
    }

    public refreshLook(): void {
        for (const data of this.textCubes) {
            if (data.mesh.isDisposed())
                continue;
            this.refreshCube(data);
        }
    }

    private refreshCube(data: TextCubeData): void {
        const style = this.getStyle(data.options);
        const multiMaterial = data.mesh.material;    
        if (!(multiMaterial instanceof BABYLON.MultiMaterial))
            return;
        // plain faces
        const plainMaterial = multiMaterial.subMaterials[0];

        if (plainMaterial instanceof BABYLON.StandardMaterial) {
            plainMaterial.diffuseColor.copyFrom(style.cubeColor);
            plainMaterial.alpha = style.cubeAlpha;
            plainMaterial.disableLighting = style.ignoreLighting;
        }
        // text face
        const textMaterial = multiMaterial.subMaterials[1];
        if (textMaterial instanceof BABYLON.StandardMaterial &&
            textMaterial.diffuseTexture instanceof BABYLON.DynamicTexture) {
            this.drawTextTexture(textMaterial.diffuseTexture, data.text, style.cubeColor,
                style.cubeAlpha, style.textColor, style.textAlpha);
            textMaterial.disableLighting = style.ignoreLighting;
        }
        this.applyEdges(data.mesh, data.options.renderEdges ?? this.materials.getLook().renderEdges);
    }

    public createSphereTextMaterial(name: string, text: string, sphereColor: BABYLON.Color3, textColor: BABYLON.Color3): BABYLON.StandardMaterial {

        const textureSize = 1024;
        const texture = new BABYLON.DynamicTexture(`${name}Texture`,
            { width: textureSize, height: textureSize / 2 }, this.scene, true);
        const context = texture.getContext() as CanvasRenderingContext2D;
        context.fillStyle = this.colorToCss(sphereColor, 1);
        context.fillRect(0, 0, textureSize, textureSize / 2);
        context.font = "bold 100px Arial";
        context.fillStyle = this.colorToCss(textColor, 1);
        context.textAlign = "center";
        context.textBaseline = "middle";
        // first side
        context.fillText(text, textureSize * 0.25, textureSize * 0.25);
        // opposite side
        context.fillText(text, textureSize * 0.75, textureSize * 0.25);
        texture.update();
        const material = new BABYLON.StandardMaterial(`${name}Material`, this.scene);
        material.diffuseTexture = texture;
        return material;
    }
}