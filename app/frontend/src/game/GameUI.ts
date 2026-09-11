import * as BABYLON from "@babylonjs/core";
import type { Scene } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { Materials } from "./Materials"
import { Board } from "./Board"
import { GameServerConnection } from "./GameServerConnection"
import { LOOKS } from './LookSetting';
import { CameraManager } from "./CameraManager";

//check here if I need scene or camera

export class GameUI {

    private ui: GUI.AdvancedDynamicTexture;
    private topPlayerBadge: GUI.Button | null = null;
    private midPlayerBadge: GUI.Button | null = null;
    private vsBadge: GUI.Button | null = null;
    private exitButton: GUI.Button | null = null;
    private lookButton:  GUI.Button | null = null;
    private instructions: GUI.TextBlock | null = null;
    private scene: Scene;
    private onExit: () => void;
    private materials: Materials;
    private board: Board;
    private camera: CameraManager;
    private game: GameServerConnection | null = null;
    private readonly guiFont = "IBM Plex Mono";
    private homePlayerIndex: number = 0;

    
    constructor(scene: Scene, onExit: () => void, materials: Materials, board: Board, camera: CameraManager, displayExit: boolean) {
        this.scene = scene;
        this.onExit = onExit;
        this.materials = materials;
        this.board = board;
        this.camera = camera;
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        if (displayExit)
            this.createExitButton();
        this.createLookButton();
        this.displayInstructions();
    }

    private toggleLook(): void {
        const nextLookIndex = (this.materials.getLookIndex() + 1) % LOOKS.length;
        this.materials.applyLook(nextLookIndex);
        this.board.createBoard(false);
        this.board.refreshMoves();
        this.board.refreshPreview();
        this.applyButtonLook();
    }

    public register(game: GameServerConnection): void {
        if (!this.game)
            this.game = game;
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
            text.fontFamily = this.guiFont;
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
            text.fontFamily = this.guiFont;
        }
        this.lookButton = button;
        this.applyButtonLook();
        this.ui.addControl(button);
        button.onPointerUpObservable.add(() => {
            this.toggleLook();
        });

        
    }

    private applyButtonLook(): void {

        const look = this.materials.getLook();
        const backgroundColor = look.backgroundColor;
        const backgroundAlpha = look.textCubeAlpha ?? look.cubeAlpha;

        const background = `rgba(${backgroundColor.r * 255},
            ${backgroundColor.g * 255}, ${backgroundColor.b * 255}, ${backgroundAlpha})`;

        // Exit button
        if (this.exitButton) {
            this.exitButton.background = background;
            this.exitButton.color = look.edgeColor3.toHexString();

            if (this.exitButton.textBlock)
                this.exitButton.textBlock.color = look.textColor.toHexString();
        }
        // Look button
        if (this.lookButton) {
            this.lookButton.background = background;
            this.lookButton.color = look.edgeColor3.toHexString();

            if (this.lookButton.textBlock)
                this.lookButton.textBlock.color = look.textColor.toHexString();
        }

        let otherPlayerColor: string;
        let homePlayerColor: string;
        if (this.homePlayerIndex === 0) {
            homePlayerColor = look.player1Color.toHexString();
            otherPlayerColor = look.player2Color.toHexString();
        } else {
            homePlayerColor = look.player2Color.toHexString();
            otherPlayerColor = look.player1Color.toHexString();
        }

        // home Player
        if (this.topPlayerBadge) {


            this.topPlayerBadge.background = background;
            this.topPlayerBadge.color = homePlayerColor;

            if (this.topPlayerBadge.textBlock)
                this.topPlayerBadge.textBlock.color = homePlayerColor;
        }

        // otherPlayer - can be online, guest or ai
        if (this.midPlayerBadge) {

            this.midPlayerBadge.background = background;
            this.midPlayerBadge.color = otherPlayerColor;

            if (this.midPlayerBadge.textBlock)
                this.midPlayerBadge.textBlock.color = otherPlayerColor;
        }

        // VS badge
        if (this.vsBadge) {
            const vsColor = look.vsColor.toHexString();

            this.vsBadge.color = vsColor;

            if (this.vsBadge.textBlock)
                this.vsBadge.textBlock.color = vsColor;
        }
    }

    private displayInstructions() {
        this.instructions = new GUI.TextBlock();
        this.instructions.isHitTestVisible = false;
        this.instructions.color = "gray";
        this.instructions.fontSize = 15;
        this.instructions.fontFamily = this.guiFont;
        this.instructions.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.instructions.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.instructions.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.instructions.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.instructions.paddingLeft = "40px";
        this.instructions.paddingBottom = "40px";
        this.instructions.text = "click on cube to place preview, double click or enter to place move\n1 to toggle cube sizes, mouse drag to rotate board, move with a,d,w,s,e,q";
        this.ui.addControl(this.instructions);
    }

    private createBadge(name: string): GUI.Button {
        const badge = GUI.Button.CreateSimpleButton("name", name);
        badge.height = "90px";
        badge.thickness = 3;
        const text = badge.textBlock;
        const fontSize = 50;
        if (text) {
            text.fontSize = fontSize;
            text.fontFamily = this.guiFont;
            const width = this.getBadgeWidth(name, fontSize);
            badge.width = `${width}px`;
        }
        return badge;
    }

    public playerBadges(homePlayerIndex: number, localPlayer: string, otherPlayer: string): void {
        // const look = this.materials.getLook();
        // const meshPlayer1 = this.board.createStyledMesh(look.moveStyle1, 0.3, "player1DemoMesh");     
        // meshPlayer1.position = new BABYLON.Vector3(-7,3,10);
        // meshPlayer1.material = this.materials.getPlayerMaterial(1);
        // meshPlayer1.renderingGroupId = 0;
        // meshPlayer1.isPickable = false;
        // meshPlayer1.parent = this.camera.getCamera();

        this.homePlayerIndex = homePlayerIndex;
        
        if (this.topPlayerBadge === null) {
            this.topPlayerBadge = this.createBadge(localPlayer);
            this.topPlayerBadge.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            this.topPlayerBadge.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
            this.topPlayerBadge.top = "30px";
            this.topPlayerBadge.left = "30px";
            this.ui.addControl(this.topPlayerBadge);
        }
        if (this.midPlayerBadge === null) {
            this.midPlayerBadge = this.createBadge(otherPlayer);
            this.midPlayerBadge.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            this.midPlayerBadge.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
            this.midPlayerBadge.top = "230px";
            this.midPlayerBadge.left = "30px";
            this.ui.addControl(this.midPlayerBadge);
        }
        if (this.vsBadge === null) {
            this.vsBadge = GUI.Button.CreateSimpleButton("vsBadge", "vs");     
            this.vsBadge.width = "90px";
            this.vsBadge.height = "90px";
            this.vsBadge.thickness = 0;
            this.vsBadge.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            this.vsBadge.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
            this.vsBadge.top = "130px";
            this.vsBadge.left = "30px";
            const text = this.vsBadge.textBlock;
            if (text) {
                text.fontSize = 30;
            }
            this.ui.addControl(this.vsBadge);
        }
        this.applyButtonLook();
    }

    public toggleBadge(is1: boolean) {
        if (is1 && this.topPlayerBadge && this.midPlayerBadge) {
            this.topPlayerBadge.thickness = 6;
            this.midPlayerBadge.thickness = 3;
        } else if (this.topPlayerBadge && this.midPlayerBadge) {
            this.topPlayerBadge.thickness = 3;
            this.midPlayerBadge.thickness = 6;
        }
    }



    public async displayWinner(winner: string) {
        let badge: GUI.Button | null = null;
        let newText: string;
        if (this.topPlayerBadge?.textBlock?.text === winner) {
            badge = this.topPlayerBadge;
            this.midPlayerBadge?.dispose();
            this.vsBadge?.dispose();
            newText = `${winner} Wins!`;
        } else if (this.midPlayerBadge?.textBlock?.text === winner) {
            badge = this.midPlayerBadge;
            this.topPlayerBadge?.dispose();
            this.vsBadge?.dispose();
            newText = `${winner} Wins!`;
        } else {
            badge = this.vsBadge;
            this.topPlayerBadge?.dispose();
            this.midPlayerBadge?.dispose();
            newText = winner;
        }
        if (!badge || !badge.textBlock)
                return;

        const oldWidth = badge.widthInPixels;

        const text = badge.textBlock;
        
        const newWidth = this.getBadgeWidth(newText, 50);
        text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        text.paddingLeft = "25px";


        const duration = 500;
        const startTime = performance.now();

        await new Promise<void>((resolve) => {
            const animate = (time: number) => {
                const progress = Math.min((time - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentWidth = oldWidth + (newWidth - oldWidth) * eased;
                badge.width = `${currentWidth}px`;
                if (progress < 1)
                    requestAnimationFrame(animate);
                else {
                    badge.textBlock!.text = newText;
                    resolve();
                }
            };
            requestAnimationFrame(animate);
        });
    }

    private getBadgeWidth(text: string, fontSize: number): number {
            const measureCanvas = document.createElement("canvas");
            const context = measureCanvas.getContext("2d");
            if (context) {
            context.font = `${fontSize}px "${this.guiFont}"`;
            let width = context.measureText(text).width + 50;
                if (width < 90)
                    width = 90;
                return width;
            }
            return 90;
    }




    public dispose(): void {
   




        this.ui.dispose();
    }



}