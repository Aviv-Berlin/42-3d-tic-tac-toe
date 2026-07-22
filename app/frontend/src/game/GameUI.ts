import * as BABYLON from "@babylonjs/core";
import type { AbstractMesh, Scene, StandardMaterial, Mesh, Material } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { Materials } from "./Materials"

type CubeRowAnchor = "left" | "center" | "right";

interface TextCubeRowOptions {
    name: string;
    parent?: BABYLON.Node;
    position?: BABYLON.Vector3;
    cubeSize?: number;
    gap?: number;
    anchor?: CubeRowAnchor;
    alwaysOnTop?: boolean;
    onClick?: () => void;
}

interface TextCubeRowData {
    cubeSize: number;
    gap: number;
    anchor: CubeRowAnchor;
}

interface CubeRowPose {
    position: BABYLON.Vector3;
    scale: number;
    anchor: CubeRowAnchor;
}

export class GameUI {

    private ui: GUI.AdvancedDynamicTexture;
    private playerNameRow: BABYLON.TransformNode | null = null;
    private exitRow: BABYLON.TransformNode | null = null;
    private instructions: GUI.TextBlock | null = null;
    private scene: Scene;
    private onExit: () => void;
    private materials: Materials;
    private winnerMessageRow: BABYLON.TransformNode | null = null;
    private rowAnimations =
    new Map<BABYLON.TransformNode, BABYLON.AnimationGroup>();

    
    constructor(scene: Scene, onExit: () => void, materials: Materials) {
        this.scene = scene;
        this.onExit = onExit;
        this.materials = materials;
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.createExitCubeRow();
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

        const cubeXPositions = this.getCubeXPositions(labels.length, cubeSize, gap, anchor);
        root.metadata = {textCubeRow: { cubeSize, gap, anchor } satisfies TextCubeRowData};

        labels.forEach((label, index) => { const cubeName = `${options.name}Cube${index}`;
            const cube = BABYLON.MeshBuilder.CreateBox(cubeName, { size: cubeSize }, this.scene);
            cube.parent = root;
            cube.metadata = {textCubeIndex: index};
            cube.position.x = cubeXPositions[index];
            cube.material = this.materials.createTextCubeMaterial(cubeName, label);


            if (options.alwaysOnTop) {
                cube.renderingGroupId = 2;
                cube.material.depthFunction = BABYLON.Constants.ALWAYS;
                cube.material.disableDepthWrite = true;
            }

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
                alwaysOnTop :true,
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

    public async playerTitle(player: string): Promise<void> {
        const camera = this.scene.activeCamera;
        if (!camera)
            throw new Error("No active camera found");
        const finalPlayerPos = new BABYLON.Vector3(-30, 14, 40);
        if (this.playerNameRow === null) {
            this.playerNameRow = this.createTextCubeRow(Array.from(player.toUpperCase()), {
                name: "playerName",
                parent: camera,
                position: new BABYLON.Vector3(-30, 14, 40), cubeSize: 2, gap: 0.25,
                anchor: "left",
                alwaysOnTop :true,
            });
            return ;
        }
        const previousRow = this.playerNameRow;
        const exitAnimation = this.animateCubeRow(previousRow , { position: new BABYLON.Vector3(-30, -20, 40), scale: 1, anchor: "left"},
            false, 30, 3, 60).then(() => { this.disposeTextCubeRow(previousRow )});
        //this line will create a gap between first and second animation
        //await new Promise<void>((resolve) => setTimeout(resolve, -1000));
        const newPlayer = this.createTextCubeRow(Array.from(player.toUpperCase()), {
                name: "playerName",
                parent: camera,
                position: new BABYLON.Vector3(-30, 14, 40), cubeSize: 2, gap: 0.25,
                anchor: "left",
                alwaysOnTop :true,
            }
        );
        this.playerNameRow = newPlayer;
        const entranceAnimation = this.animateCubeRow(newPlayer , { position: new BABYLON.Vector3(-30, 18, 40), scale: 1, anchor: "left"},
            true, 30, 3, 60);
        await Promise.all([exitAnimation, entranceAnimation]);
    }

    private animateCubeRow(row: BABYLON.TransformNode | null, pose: CubeRowPose, poseIsStart: boolean,
        durationFrames: number = 30,  staggerFrames: number = 3, fps: number = 60): Promise<void> { return new Promise((resolve) => {
        if (!row) {
            resolve();
            return;
        }
        const rowData = row.metadata?.textCubeRow as TextCubeRowData | undefined;
        if (!rowData)
            throw new Error(`Missing row metadata for ${row.name}`);
        const cubes = row.getChildMeshes().sort((a, b) => {
            const indexA = Number(a.metadata?.textCubeIndex ?? 0);
            const indexB = Number(b.metadata?.textCubeIndex ?? 0);
            return indexA - indexB;
        });
        if (cubes.length === 0) {
            resolve();
            return;
        }
        // This animation assumes the TransformNode uses uniform scaling.
        const currentScale = row.scaling.x;
        const currentPose: CubeRowPose = {
            position: row.position.clone(),
            scale: currentScale,
            anchor: rowData.anchor
        };
        const suppliedPose: CubeRowPose = {
            position: pose.position.clone(),
            scale: pose.scale,
            anchor: pose.anchor
        };
        const startPose = poseIsStart ? suppliedPose : currentPose;
        const endPose = poseIsStart ? currentPose : suppliedPose;
        const startXPositions = this.getCubeXPositions(
            cubes.length,
            rowData.cubeSize,
            rowData.gap,
            startPose.anchor
        );
        const endXPositions = this.getCubeXPositions(
            cubes.length,
            rowData.cubeSize,
            rowData.gap,
            endPose.anchor
        );
        //Calculate how every cube would appear after applying the row position, scale and anchor.
        const getComposedPosition = ( rowPose: CubeRowPose, cubeX: number ): BABYLON.Vector3 => {
            return new BABYLON.Vector3(rowPose.position.x + cubeX * rowPose.scale, rowPose.position.y, rowPose.position.z);};
        const startScale = new BABYLON.Vector3(startPose.scale, startPose.scale, startPose.scale);
        const endScale = new BABYLON.Vector3(endPose.scale, endPose.scale, endPose.scale);
        //Temporarily make the row root neutral. Each cube now holds its complete position and scale, allowing independent movement.
        row.position.set(0, 0, 0);
        row.scaling.set(1, 1, 1);
        const animationGroup = new BABYLON.AnimationGroup(`${row.name}StaggerAnimation`, this.scene);
        const easing = new BABYLON.CubicEase();
        easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        cubes.forEach((cube, index) => {
            const delay = index * staggerFrames;
            const endFrame = delay + durationFrames;
            const startPosition = getComposedPosition(startPose, startXPositions[index]);
            const endPosition = getComposedPosition(endPose, endXPositions[index]);
            //Set the visual beginning before starting the animation.
            cube.position.copyFrom(startPosition);
            cube.scaling.copyFrom(startScale);
            const positionAnimation = new BABYLON.Animation(
                `${cube.name}PositionAnimation`,
                "position",
                fps,
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            const positionKeys = delay === 0 ? [
                    { frame: 0, value: startPosition.clone()},
                    { frame: endFrame, value: endPosition.clone() } ]
                : [ { frame: 0, value: startPosition.clone() },
                    { frame: delay, value: startPosition.clone() },
                    { frame: endFrame, value: endPosition.clone() } ];
            positionAnimation.setKeys(positionKeys);
            positionAnimation.setEasingFunction(easing);
            const scalingAnimation = new BABYLON.Animation( `${cube.name}ScalingAnimation`,
                "scaling", fps, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT );

            const scalingKeys = delay === 0 ? [ {
                        frame: 0, value: startScale.clone() },
                    {   frame: endFrame, value: endScale.clone()
                    } ] : [ {
                        frame: 0,
                        value: startScale.clone() }, {
                        frame: delay, value: startScale.clone() },
                    {   frame: endFrame, value: endScale.clone() } ];
            scalingAnimation.setKeys(scalingKeys);
            scalingAnimation.setEasingFunction(easing);
            animationGroup.addTargetedAnimation( positionAnimation, cube);
            animationGroup.addTargetedAnimation( scalingAnimation, cube );
        });
        animationGroup.onAnimationGroupEndObservable.addOnce(() => {
            // Restore the normal row structure without changing the cubes' visible final positions.
            row.position.copyFrom(endPose.position);
            row.scaling.set(
                endPose.scale,
                endPose.scale,
                endPose.scale
            );
            cubes.forEach((cube, index) => {
                cube.position.set(endXPositions[index], 0, 0);
                cube.scaling.set(1, 1, 1);
            });
            rowData.anchor = endPose.anchor;
            animationGroup.dispose();
            resolve();
        });
        animationGroup.play(false);
        });
    } 

    private disposeTextCubeRow(row: BABYLON.TransformNode | null) : void {
        if (!row)
            return;
        const animation = this.rowAnimations.get(row);
        if (animation) {
            animation.stop();
            animation.dispose();
            this.rowAnimations.delete(row);
        }
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
        const camera = this.scene.activeCamera;
        if (!camera)
            throw new Error("No active camera found");
        this.animateCubeRow(this.playerNameRow, { position: new BABYLON.Vector3(0, 3, 30), scale: 2, anchor: "center"}, false, 30, 3);
        setTimeout(() => {
        this.winnerMessageRow = this.createTextCubeRow(
            Array.from("wins!"),
            {
                name: "winnerMessage",
                parent: camera,
                position: new BABYLON.Vector3(0, -3, 30), cubeSize: 4, gap: 0.375,
                anchor: "center",
                alwaysOnTop :true
            });
        this.animateCubeRow(this.winnerMessageRow, { position: new BABYLON.Vector3(-30, -14, 30), scale: 0.5, anchor: "left"}, true, 30, 3);
        }, 500);

    }


    public dispose(): void {
        this.disposeTextCubeRow(this.playerNameRow);
        this.disposeTextCubeRow(this.exitRow);
        this.disposeTextCubeRow(this.winnerMessageRow);

        this.playerNameRow = null;
        this.exitRow = null;
        this.winnerMessageRow = null;

        this.ui.dispose();
    }

    private getFirstCubeX(cubeCount: number, cubeSize: number, gap: number, anchor: CubeRowAnchor): number {
        const totalWidth = cubeCount === 0 ? 0 : cubeCount * cubeSize + (cubeCount - 1) * gap;

        switch (anchor) {
            case "left":
                return cubeSize / 2;

            case "right":
                return -totalWidth + cubeSize / 2;

            case "center":
                return -totalWidth / 2 + cubeSize / 2;
        }
    }

    private getCubeXPositions(cubeCount: number, cubeSize: number, gap: number, anchor: CubeRowAnchor): number[] {
        const firstCubeX = this.getFirstCubeX(cubeCount, cubeSize, gap, anchor);
        const step = cubeSize + gap;
        return Array.from({ length: cubeCount }, (_, index) => firstCubeX + index * step);
    }



}