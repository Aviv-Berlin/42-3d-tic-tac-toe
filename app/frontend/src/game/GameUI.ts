import * as BABYLON from "@babylonjs/core";
import type { Scene } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { Materials } from "./Materials"
import { Board } from "./Board"
import { GameServerConnection } from "./GameServerConnection"
import { LOOKS, PlayerColors } from './LookSetting';
import { TextCubeFactory } from "./TextCubeFactory";
import { GridPosition, CellState } from "../../../shared/game/Types"

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
    private player1Badge: GUI.Button | null = null;
    private player2Badge: GUI.Button | null = null;
    private exitRow: BABYLON.TransformNode | null = null;
    private exitButton: GUI.Button | null = null;
    private lookRow: BABYLON.TransformNode | null = null;
    private lookButton:  GUI.Button | null = null;
    private instructions: GUI.TextBlock | null = null;
    private scene: Scene;
    private onExit: () => void;
    private materials: Materials;
    private winnerMessageRow: BABYLON.TransformNode | null = null;
    private board: Board;
    private readonly textCubeFactory: TextCubeFactory;
    private game: GameServerConnection | null = null;

    
    constructor(scene: Scene, onExit: () => void, materials: Materials, board: Board) {
        this.scene = scene;
        this.onExit = onExit;
        this.materials = materials;
        this.board = board;
        this.textCubeFactory =
        new TextCubeFactory(scene, materials);
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        //this.createExitCubeRow();
        this.createExitButton();
        this.createLookButton();
        //this.createLookCubeRow();
        this.displayInstructions();
    }

    private toggleLook(): void {
        const nextLookIndex = (this.materials.getLookIndex() + 1) % LOOKS.length;
        this.materials.applyLook(nextLookIndex);
        this.board.createBoard();
        this.board.refreshMoves();
        this.board.refreshPreview();
        this.textCubeFactory.refreshLook();
        this.board.refreshTextCubes();
        this.applyButtonLook();
    }

    public register(game: GameServerConnection): void {
        if (!this.game)
            this.game = game;
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
        root.metadata = { textCubeRow: { cubeSize, gap, anchor } satisfies TextCubeRowData };
        labels.forEach((label, index) => {
            const cube = this.textCubeFactory.createTextCube(label,
                {
                    name: `${options.name}Cube${index}`,
                    size: cubeSize,
                    alwaysOnTop: options.alwaysOnTop,
                    onClick: options.onClick
                });

            cube.parent = root;
            cube.position.x = cubeXPositions[index];

            cube.metadata = { ...cube.metadata,  textCubeIndex: index };
        });
        return root;
    }


    private createExitButton(): void {
        const button = GUI.Button.CreateSimpleButton("diamondButton", "EXIT");
        button.width = "70px";
        button.height = "70px";
        button.thickness = 3;
        // top-right corner
        button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        button.top = "30px";
        button.left = "-30px";
        // rotate square → diamond
        button.rotation = Math.PI / 4;
        const text = button.textBlock;
        if (text) {
            text.rotation = -Math.PI / 4;
            text.fontSize = 16;
        }
        this.exitButton = button;
        this.applyButtonLook();
        this.ui.addControl(button);
        button.onPointerUpObservable.add(() => {
            if (this.game)
                this.game.exitGame()
        });
    }

        private createLookButton(): void {
        const button = GUI.Button.CreateSimpleButton("diamondButton", "LOOK");
        button.width = "80px";
        button.height = "80px";
        button.cornerRadius = 55;
        button.thickness = 3;
        // top-right corner
        button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        button.top = "-30px";
        button.left = "-30px";
        const text = button.textBlock;
        if (text) {
            text.fontSize = 16;
        }
        this.lookButton = button;
        this.applyButtonLook();
        this.ui.addControl(button);
        button.onPointerUpObservable.add(() => {
            this.toggleLook();
        });
    }

    private applyButtonLook(): void {
        if (!this.exitButton)
            return;
        const look = this.materials.getLook();
        const backgroundColor = look.textCubeColor ?? look.cubeColor;
        const backgroundAlpha = look.textCubeAlpha ?? look.cubeAlpha;
        this.exitButton.background = `rgba(${backgroundColor.r * 255},
            ${backgroundColor.g * 255}, ${backgroundColor.b * 255},
            ${backgroundAlpha})`;
        this.exitButton.color = look.edgeColor.toHexString();
        if (this.exitButton.textBlock)
            this.exitButton.textBlock.color = look.textColor.toHexString();
        
        if (!this.lookButton)
            return;
        this.lookButton.background = `rgba(${backgroundColor.r * 255},
            ${backgroundColor.g * 255}, ${backgroundColor.b * 255},
            ${backgroundAlpha})`;
        this.lookButton.color = look.edgeColor.toHexString();
        if (this.lookButton.textBlock)
            this.lookButton.textBlock.color = look.textColor.toHexString();
        
        if (!this.player1Badge)
            return;
        // if (look.playerColors?.[0])
        //  this.player1Badge.color = look.playerColors[0].toHexString();
        // else
        //     this.player1Badge.color = look.edgeColor.toHexString();
        this.player1Badge.color = look.textColor.toHexString();
        this.player1Badge.background = `rgba(${backgroundColor.r * 255},
            ${backgroundColor.g * 255}, ${backgroundColor.b * 255},
            ${backgroundAlpha})`;
        ;
        if (this.player1Badge.textBlock)
            this.player1Badge.textBlock.color = look.textColor.toHexString();

        if (!this.player2Badge)
            return;
        if (look.playerColors?.[1]) {
            this.player2Badge.color = look.playerColors[1].toHexString(); 
            if (this.player2Badge.textBlock)
                this.player2Badge.textBlock.color = look.playerColors[1].toHexString();
        }
        else
            this.player2Badge.color = look.edgeColor.toHexString();
        this.player2Badge.background = `rgba(${backgroundColor.r * 255},
            ${backgroundColor.g * 255}, ${backgroundColor.b * 255},
            ${backgroundAlpha})`;
        //if (this.player2Badge.textBlock)
        //   this.player2Badge.textBlock.color = look.textColor.toHexString();
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
                    //close the websockets?
                    if (this.game)
                        this.game.exitGame()
                    //this.onExit();
                }
            }
        );
    }

    private createLookCubeRow(): void {
        const camera = this.scene.activeCamera;
        if (!camera)
            throw new Error("No active camera found");
        this.disposeTextCubeRow(this.lookRow);
        this.lookRow = this.createTextCubeRow(Array.from("LOOK"), { name: "look", parent: camera,
                position: new BABYLON.Vector3(30, -14, 40), cubeSize: 1, gap: 0.25,
                // Position marks the right edge.
                // The letters extend toward the left.
                anchor: "right",
                alwaysOnTop :true,
                onClick: () => {
                    this.toggleLook();
                }
            }
        );
    }



    private displayInstructions() {
        this.instructions = new GUI.TextBlock();
        this.instructions.isHitTestVisible = false;
        this.instructions.color = "gray";
        this.instructions.fontSize = 15;
        this.instructions.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.instructions.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.instructions.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.instructions.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.instructions.paddingLeft = "40px";
        this.instructions.paddingBottom = "40px";
        this.instructions.text = "click on cube to place preview, double click or enter to place move\n1 to toggle cube sizes, mouse drag to rotate board, move with a,d,w,s,e,q";
        this.ui.addControl(this.instructions);
    }

    public playerBadges(player1: string, player2: string): void {
        if (this.player1Badge === null) {
            const button = GUI.Button.CreateSimpleButton("player1Badge", player1);
            let width = player1.length * 40;
            if (width < 90)
                width = 90;
            button.width = `${width}px`;
            button.height = "90px";
            button.thickness = 6;
            button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
            button.top = "30px";
            button.left = "30px";
            const text = button.textBlock;
            if (text) {
                text.fontSize = 50;
            }
            this.player1Badge = button;
            this.ui.addControl(button);
        }
        if (this.player2Badge === null) {
            this.player2Badge = GUI.Button.CreateSimpleButton("player2Badge", player2);
            let width = player2.length * 40;
            if (width < 90)
                width = 90;
            this.player2Badge.width = `${width}px`;
            this.player2Badge.height = "90px";
            this.player2Badge.thickness = 3;
            this.player2Badge.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            this.player2Badge.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
            this.player2Badge.top = "230px";
            this.player2Badge.left = "30px";
            const text = this.player2Badge.textBlock;
            if (text) {
                text.fontSize = 50;
            }
            //this.player2Badge = button;
            this.ui.addControl(this.player2Badge);
        }
        const vs = GUI.Button.CreateSimpleButton("player2Badge", "vs");
            
            vs.width = "90px";
            vs.height = "90px";
            vs.thickness = 0;
            vs.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            vs.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
            vs.top = "130px";
            vs.left = "30px";
            vs.color = "black";
            const text = vs.textBlock;
            if (text) {
                text.fontSize = 30;
            }
            //this.player2Badge = button;
            this.ui.addControl(vs);
        this.applyButtonLook();

    }

    public async playerTitle(player: string): Promise<void> {

        const camera = this.scene.activeCamera;
        if (!camera)
            throw new Error("No active camera found");
        if (player === undefined)
            player = "player name error!"
        if (this.playerNameRow === null) {
            this.playerNameRow = this.createTextCubeRow(Array.from(player.toUpperCase()), {
                name: "playerName",
                parent: camera,
                position: new BABYLON.Vector3(-28, 14, 40), cubeSize: 2, gap: 0.25,
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
                position: new BABYLON.Vector3(-28, 14, 40), cubeSize: 2, gap: 0.25,
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

    public async displayWinner(firstLine: string, secondLine: string): Promise<void> {
        const camera = this.scene.activeCamera;
        if (!camera)
            throw new Error("No active camera found");
        await this.playerTitle(firstLine);
        await this.animateCubeRow(this.playerNameRow, { position: new BABYLON.Vector3(0, 3, 30), scale: 2, anchor: "center"}, false, 30, 3);
        await new Promise<void>((resolve) => { setTimeout(resolve, 500); });

        this.winnerMessageRow = this.createTextCubeRow(
            Array.from(secondLine),
            {
                name: "winnerMessage",
                parent: camera,
                position: new BABYLON.Vector3(0, -3, 30), cubeSize: 4, gap: 0.375,
                anchor: "center",
                alwaysOnTop :true
            });
        await this.animateCubeRow(this.winnerMessageRow, { position: new BABYLON.Vector3(-30, -14, 30), scale: 0.5, anchor: "left"}, true, 30, 3);

    }

    public async displayDraw(): Promise<void> {
        const camera = this.scene.activeCamera;
        if (!camera)
            throw new Error("No active camera found");
        const previousRow = this.playerNameRow;
        if (previousRow) {
            await this.animateCubeRow( previousRow,
                { position: new BABYLON.Vector3(-30, -20, 40), scale: 1,  anchor: "left" }, false, 30, 3 );
            this.disposeTextCubeRow(previousRow);
            if (this.playerNameRow === previousRow)
                this.playerNameRow = null;
        }

        this.winnerMessageRow = this.createTextCubeRow(Array.from("DRAW"),
            {
                name: "drawMessage",
                parent: camera,
                position: new BABYLON.Vector3(0, 0, 30),
                cubeSize: 4,
                gap: 0.375,
                anchor: "center",
                alwaysOnTop: true
            }
        );

        await this.animateCubeRow(this.winnerMessageRow,
            { position: new BABYLON.Vector3(0, 18, 30), scale: 1, anchor: "center" }, true, 30, 3);
    }

    public dispose(): void {
        this.disposeTextCubeRow(this.playerNameRow);
        this.disposeTextCubeRow(this.exitRow);
        this.disposeTextCubeRow(this.winnerMessageRow);
        this.disposeTextCubeRow(this.lookRow);


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