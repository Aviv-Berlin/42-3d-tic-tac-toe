import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";

export interface TextCubeOptions {
    name?: string;
    size?: number;
    letterFace?: number;
    faceTexts?: Partial<Record<number, string>>;
    renderEdges?: boolean;
    alwaysOnTop?: boolean;
    cubeOpacity?: number;
    textOpacity?: number;
    cubeColor?: BABYLON.Color3;
    ignoreLighting?: boolean;
    onClick?: () => void;
}

export class TextCubeFactory {
    private readonly scene: BABYLON.Scene;
    private readonly materials: Materials;

    constructor(scene: BABYLON.Scene, materials: Materials) {
        this.scene = scene;
        this.materials = materials;
    }

    public createTextCube( text: string, options: TextCubeOptions = {}): BABYLON.Mesh {

        const name = options.name ?? `textCube-${text}`;
        const size = options.size ?? 2;
        const renderEdges = options.renderEdges ?? false;

        const cube = BABYLON.MeshBuilder.CreateBox(name, { size }, this.scene);

        cube.metadata = { textCubeLabel: text };

        const cubeOpacity = options.cubeOpacity ?? 1;
        const textOpacity = options.textOpacity ?? 1;
        const cubeColor = options.cubeColor ?? this.materials.getCubeColor();

        // Plain cube material
        const plainMaterial = this.materials.createPlainCubeMaterial(`${name}PlainMaterial` );

        plainMaterial.alpha = cubeOpacity;
        plainMaterial.diffuseColor = cubeColor.clone();
        plainMaterial.disableLighting = options.ignoreLighting ?? false;

        const multiMaterial =
            new BABYLON.MultiMaterial(
                `${name}MultiMaterial`,
                this.scene
            );

        // Material 0 is always the plain cube material
        multiMaterial.subMaterials = [plainMaterial];

        // By default every face uses the plain material
        const materialIndexes = new Array(6).fill(0);

        // Different text on different faces
        if (options.faceTexts) {

            for (let face = 0; face < 6; face++) {

                const faceText = options.faceTexts[face];

                if (faceText === undefined)
                    continue;

                const textMaterial =
                    this.materials.createTextCubeMaterial(
                    `${name}TextMaterial-${face}`,
                    faceText,
                    cubeColor,
                    cubeOpacity,
                    textOpacity
                    );

                textMaterial.alpha = textOpacity;

                materialIndexes[face] =
                    multiMaterial.subMaterials.length;

                multiMaterial.subMaterials.push(textMaterial);
            }

        } else {

            const letterFace = options.letterFace ?? 1;

            // Only create a text material when there is actually text
            if (text !== "") {

                const textMaterial =
                    this.materials.createTextCubeMaterial(
                    `${name}TextMaterial`,
                    text,
                    cubeColor,
                    cubeOpacity,
                    textOpacity
                    );

                textMaterial.alpha = textOpacity;

                // Material 1 is the text material
                multiMaterial.subMaterials.push(textMaterial);

                if (letterFace === 6) {
                    // Text on all six faces
                    materialIndexes.fill(1);
                } else {
                    // Text only on the selected face
                    materialIndexes[letterFace] = 1;
                }
            }
        }

        cube.material = multiMaterial;

        this.createFaceSubMeshes(
            cube,
            materialIndexes
        );

        this.materials.applyTextCubeLook(
            cube,
            renderEdges
        );

        if (options.alwaysOnTop) {
            cube.renderingGroupId = 2;
            multiMaterial.depthFunction =
                BABYLON.Constants.ALWAYS;
            multiMaterial.disableDepthWrite = true;
        }

        this.configurePicking(
            cube,
            options.onClick
        );

        return cube;
    }

    private createFaceSubMeshes(
        cube: BABYLON.Mesh,
        materialIndexes: number[]
    ): void {

        cube.subMeshes = [];

        const vertexCount = cube.getTotalVertices();

        for (let face = 0; face < 6; face++) {
            new BABYLON.SubMesh(
                materialIndexes[face],
                0,
                vertexCount,
                face * 6,
                6,
                cube
            );
        }
    }

    private configurePicking(
        cube: BABYLON.Mesh,
        onClick?: () => void
    ): void {
        if (!onClick) {
            cube.isPickable = false;
            return;
        }

        cube.isPickable = true;
        cube.actionManager =
            new BABYLON.ActionManager(this.scene);

        cube.actionManager.hoverCursor = "pointer";

        cube.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                onClick
            )
        );
    }
}