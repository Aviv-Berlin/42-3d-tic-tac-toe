import * as BABYLON from "@babylonjs/core";
import type { AbstractMesh, Scene, StandardMaterial, Mesh, Material } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { Materials } from "./Materials"

type CubeRowAnchor = "left" | "center" | "right";
type AnimationDirection = "current" | "above" | "below" | "left" | "right" | "behind";

interface TextCubeRowOptions {
    name: string;
    parent?: BABYLON.Node;
    position?: BABYLON.Vector3;
    cubeSize?: number;
    gap?: number;
    anchor?: CubeRowAnchor;
    onClick?: () => void;
}

export class GameUI {

    private ui: GUI.AdvancedDynamicTexture;
    private playerNameRow: BABYLON.TransformNode | null = null;
    private exitRow: BABYLON.TransformNode | null = null;
    private instructions: GUI.TextBlock | null = null;
    private scene: Scene;
    private onExit: () => void;
    private materials: Materials;

    
    constructor(scene: Scene, onExit: () => void, materials: Materials) {
        this.scene = scene;
        this.onExit = onExit;
        this.materials = materials;
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.playerTitle("");
        this.createExitCubeRow();
       // this.createPlayerCube("test");
        this.displayInstructions();
    }

    private createTextCubeRow(labels: readonly string[], options: TextCubeRowOptions): BABYLON.TransformNode {
        const cubeSize = options.cubeSize ?? 2;
        const gap = options.gap ?? 0.2;
        const anchor = options.anchor ?? "center";
        const root = new BABYLON.TransformNode(`${options.name}Root`, this.scene);
        if (options.parent)
            root.parent = options.parent;
        if (options.position) 
            root.position.copyFrom(options.position);
        const step = cubeSize + gap;
        const totalWidth = labels.length === 0 ? 0 : labels.length * cubeSize + (labels.length - 1) * gap;
        let firstCubeX: number;
        switch (anchor) {
            case "left":
                firstCubeX = cubeSize / 2;
                break;

            case "right":
                firstCubeX =
                    -totalWidth + cubeSize / 2;
                break;

            case "center":
                firstCubeX =
                    -totalWidth / 2 + cubeSize / 2;
                break;
        }

        labels.forEach((label, index) => { const cubeName = `${options.name}Cube${index}`;
            const cube = BABYLON.MeshBuilder.CreateBox(cubeName, { size: cubeSize }, this.scene);
            cube.parent = root;
            cube.position.x = firstCubeX + index * step;
            cube.material = this.materials.createTextCubeMaterial(cubeName, label);

            if (options.onClick) {
                cube.isPickable = true;
                cube.actionManager = new BABYLON.ActionManager(this.scene);
                cube.actionManager.hoverCursor = "pointer";
                cube.actionManager.registerAction(new BABYLON.ExecuteCodeAction
                    (BABYLON.ActionManager.OnPickTrigger,
                        () => {
                            options.onClick?.();}));
            }
            else {
                cube.isPickable = false;
            }
        });
        return root;
    }




    private createExitCubeRow(): void {
        const camera = this.scene.activeCamera;
        if (!camera)
            throw new Error("No active camera found");
        this.disposeTextCubeRow(this.exitRow);
        this.exitRow = this.createTextCubeRow(Array.from("EXIT"), { name: "exit", parent: camera,
                position: new BABYLON.Vector3(30, 14, 40), cubeSize: 1, gap: 0.25,
                // Position marks the right edge.
                // The letters extend toward the left.
                anchor: "right",
                onClick: () => {
                    this.onExit();
                }
            }
        );
    }

    private displayInstructions() {
        this.instructions = new GUI.TextBlock();
        this.instructions.color = "gray";
        this.instructions.fontSize = 20;
        this.instructions.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.instructions.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.instructions.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.instructions.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.instructions.paddingLeft = "40px";
        this.instructions.paddingBottom = "40px";
        this.instructions.text = "click on cube to place preview, double click or enter to place move\n1 to toggle cube sizes, mouse drag to rotate board, move with j,l,i,m,u,h";
        this.ui.addControl(this.instructions);
    }

    public playerTitle(player: string): void {
        const camera = this.scene.activeCamera;
        if (!camera)
            throw new Error("No active camera found");
        //this.animateCubeRow(this.playerNameRow);
        this.disposeTextCubeRow(this.playerNameRow);
        this.playerNameRow = this.createTextCubeRow(
            Array.from(player),
            {
                name: "playerName",
                parent: camera,
                position: new BABYLON.Vector3(-30, 14, 40), cubeSize: 2, gap: 0.25,
                // Position marks the left edge.
                // The letters extend toward the right.
                anchor: "left"
            }
        );
    }

    private animateCubeRow(row: BABYLON.TransformNode | null): void {
        if (!row)
            return;
        const offset = new BABYLON.Vector3(30, -14, -20);
        const cubes = row.getChildMeshes();
        for (const cube of cubes) {
            const startPos = cube.position.clone();
            BABYLON.Animation.CreateAndStartAnimation("MoveCube", cube, "position", 60, 30,
                startPos, startPos.add(offset), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        }
    }

    private disposeTextCubeRow(row: BABYLON.TransformNode | null) : void {
        if (!row)
            return;
        const cubes = row.getChildMeshes();
        for (const cube of cubes) {
            cube.actionManager?.dispose();
            cube.actionManager = null;
            const material = cube.material;
            cube.material = null;
            if (material) {
                // Every text cube owns its own dynamic texture,
                // so it is safe to dispose the texture here.
                material.dispose(true, true);
            }
            cube.dispose();
        }
        row.dispose();
    }

    public displayWinner(winner: string): void {
        const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("winnerUI", true, this.scene);

        const winnerText = new GUI.TextBlock();
        //this.animateCubeRow(this.playerNameRow);
        winnerText.text = `${winner} wins!`;
        winnerText.color = "gray";
        winnerText.fontSize = 150;
        winnerText.top = "0px";
        winnerText.left = "0px";

        ui.addControl(winnerText);
        // this.disposeTextCubeRow(this.playerNameRow);
        // const camera = this.scene.activeCamera;
        // if (!camera)
        //     throw new Error("No active camera found");
        // this.createTextCubeRow(
        //     Array.from(winner),
        //     {
        //         name: "playerName",
        //         parent: camera,
        //         position: new BABYLON.Vector3(0, 0.3, 1.2), cubeSize: 0.15, gap: 0.02,
        //         // Position marks the left edge.
        //         // The letters extend toward the right.
        //         anchor: "center"
        //     }
        // );
        // this.createTextCubeRow(
        //     Array.from("wins!"),
        //     {
        //         name: "playerName",
        //         parent: camera,
        //         position: new BABYLON.Vector3(0, -0.3, 1.2), cubeSize: 0.15, gap: 0.02,
        //         // Position marks the left edge.
        //         // The letters extend toward the right.
        //         anchor: "center"
        //     }
        // );
    }


    public dispose(): void {
        this.disposeTextCubeRow(this.playerNameRow);
        this.disposeTextCubeRow(this.exitRow);

        this.playerNameRow = null;
        this.exitRow = null;

        this.ui.dispose();
    }

}