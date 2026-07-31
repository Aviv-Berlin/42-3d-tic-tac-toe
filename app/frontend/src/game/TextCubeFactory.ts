import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";

export interface TextCubeOptions {
    name?: string;
    size?: number;
    renderEdges?: boolean;
    alwaysOnTop?: boolean;
    onClick?: () => void;
}

export class TextCubeFactory {
    private readonly scene: BABYLON.Scene;
    private readonly materials: Materials;

    constructor(scene: BABYLON.Scene, materials: Materials) {
        this.scene = scene;
        this.materials = materials;
    }

    public createTextCube(text: string, options: TextCubeOptions = {}): BABYLON.Mesh {
        const name = options.name ?? `textCube-${text}`;
        const size = options.size ?? 2;
        const renderEdges = options.renderEdges ?? false;
        const cube = BABYLON.MeshBuilder.CreateBox(name, { size }, this.scene);
        cube.metadata = { textCubeLabel: text };

        const plainMaterial = this.materials.createPlainCubeMaterial(`${name}PlainMaterial`);
        const textMaterial =  this.materials.createTextCubeMaterial(`${name}TextMaterial`, text);
        const multiMaterial = new BABYLON.MultiMaterial(`${name}MultiMaterial`, this.scene);
        multiMaterial.subMaterials = [ plainMaterial, textMaterial ];
        cube.material = multiMaterial;
        this.createFaceSubMeshes(cube);
        this.materials.applyTextCubeLook(cube, renderEdges);

        if (options.alwaysOnTop) {
            cube.renderingGroupId = 2;
            multiMaterial.depthFunction =
                BABYLON.Constants.ALWAYS;
            multiMaterial.disableDepthWrite = true;
        }
        this.configurePicking(cube, options.onClick);
        return cube;
    }

    private createFaceSubMeshes(cube: BABYLON.Mesh): void {
        cube.subMeshes = [];

        const vertexCount = cube.getTotalVertices();

        for (let face = 0; face < 6; face++) {
            let materialIndex: number;
            if (face === 1)
                materialIndex = 1; // front face: text
            else
                materialIndex = 0; // other faces: plain
            new BABYLON.SubMesh(materialIndex, 0, vertexCount, face * 6, 6, cube);
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