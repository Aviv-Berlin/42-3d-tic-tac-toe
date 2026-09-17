import * as BABYLON from "@babylonjs/core";
import type { Scene, Mesh } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { Materials } from "./Materials"
import { Board } from "./Board"
import { GameServerConnection } from "./GameServerConnection"
import { LOOKS } from './LookSetting';
import { CameraManager } from "./CameraManager";

//check here if I need scene or camera

export const ANCHORS = {
    // [signX, signY]
    "bottom-left": [-1, -1],
    "bottom-right": [1, -1],
    "center-left": [-1, 0],
    "center-right": [1, 0],
    "top-left": [-1, 1],
    "top-right": [1, 1],
};

type pinOptions = {
    anchor: keyof typeof ANCHORS;
    distance?: number;
    marginXPx?: number;
    marginYPx?: number;
    sizePx?: number;
};

export class GameUI {

    private ui: GUI.AdvancedDynamicTexture;
    private topPlayerBadge: GUI.Button | null = null;
    private midPlayerBadge: GUI.Button | null = null;
    private homeBadgeMesh: Mesh | null = null;
    private otherBadgeMesh: Mesh | null = null;
    private badgeMeshObserver: BABYLON.Observer<Scene> | null = null;
    private badgeCamera: BABYLON.FreeCamera;
    private readonly badgeLayerMask = 0x10000000;
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
        
        const mainCamera = this.camera.getCamera();

        // Reserve this layer for the badge meshes.
        mainCamera.layerMask &= ~this.badgeLayerMask;

        this.badgeCamera = new BABYLON.FreeCamera(
            "badgeCamera",
            BABYLON.Vector3.Zero(),
            scene
        );

        this.badgeCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        this.badgeCamera.minZ = 0.01;
        this.badgeCamera.maxZ = 100;
        this.badgeCamera.layerMask = this.badgeLayerMask;

        this.badgeCamera.setTarget(
            new BABYLON.Vector3(
                0,
                0,
                scene.useRightHandedSystem ? -1 : 1
            )
        );

        // Render the board and GUI first, then the indicators.
        scene.activeCameras = [mainCamera, this.badgeCamera];
        scene.activeCamera = mainCamera;

        // Mouse interaction still uses the board's camera.
        scene.cameraToUseForPointers = mainCamera;

        // Render the fullscreen GUI only once, through the main camera.
        if (this.ui.layer) {
            this.ui.layer.layerMask = mainCamera.layerMask;
        }

        this.updateBadgeCamera();

        if (displayExit)
            this.createExitButton();
        this.createLookButton();
        this.displayInstructions();
    }

    private toggleLook(): void {
        const nextLookIndex =
            (this.materials.getLookIndex() + 1) % LOOKS.length;

        this.materials.applyLook(nextLookIndex);
        this.board.createBoard(false);
        this.board.refreshMoves();
        this.board.refreshPreview();

        const homeName = this.topPlayerBadge?.textBlock?.text;
        const otherName = this.midPlayerBadge?.textBlock?.text;

        if (homeName !== undefined && otherName !== undefined) {
            this.playerBadges(this.homePlayerIndex, homeName, otherName);
        } else {
            this.applyButtonLook();
        }
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
            homePlayerColor = look.player1Badge.toHexString();
            otherPlayerColor = look.player2Badge.toHexString();
        } else {
            homePlayerColor = look.player2Badge.toHexString();
            otherPlayerColor = look.player1Badge.toHexString();
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






    // export const createScene = function () {
    //     const scene = new BABYLON.Scene(engine);
    //     scene.clearColor = new BABYLON.Color4(0.06, 0.07, 0.10, 1);

    //     const camera = new BABYLON.ArcRotateCamera(
    //         "camera", -Math.PI / 2, Math.PI / 2.6, 10, BABYLON.Vector3.Zero(), scene
    //     );
    //     camera.attachControl(canvas, true);
    //     camera.minZ = 0.1;            // must be smaller than HUD.distance

    //     new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0.4, 1, 0.2), scene);



    //     // --- the 3D UI mesh ------------------------------------------------
    //     const HUD = { anchor: "bottom-left", distance: 3, marginPx: 24, sizePx: 110 };

    //     const hud = BABYLON.MeshBuilder.CreateTorusKnot(
    //         "hudGizmo", { radius: 0.4, tube: 0.13, radialSegments: 96, tubularSegments: 24 }, scene
    //     );
    //     const hmat = new BABYLON.StandardMaterial("hmat", scene);
    //     hmat.diffuseColor = new BABYLON.Color3(0.95, 0.62, 0.25);
    //     hmat.emissiveColor = new BABYLON.Color3(0.35, 0.18, 0.04);
    //     hud.material = hmat;

    //     hud.parent = camera;
    //     hud.renderingGroupId = 1;
    //     hud.isPickable = false;

    //     scene.onBeforeRenderObservable.add(() => {
    //         pinToCorner(hud, camera, HUD);
    //         hud.rotation.y += 0.01;      // rotation is local, so it does not move it
    //         hud.rotation.x += 0.004;
    //     });

    //     return scene;
    // };


    private updateBadgeCamera(): void {
        const engine = this.scene.getEngine();
        const unitsPerPixel = 0.01;

        const halfW = engine.getRenderWidth() * unitsPerPixel / 2;
        const halfH = engine.getRenderHeight() * unitsPerPixel / 2;

        this.badgeCamera.orthoLeft = -halfW;
        this.badgeCamera.orthoRight = halfW;
        this.badgeCamera.orthoTop = halfH;
        this.badgeCamera.orthoBottom = -halfH;
    }


    private pinToCorner(mesh: Mesh, opts: pinOptions): void {
        const placement = {
            distance: 3,
            marginXPx: 24,
            marginYPx: 24,
            sizePx: 60,
            ...opts,
        };

        const engine = this.scene.getEngine();
        const unitsPerPixel = 0.01;

        const halfW = engine.getRenderWidth() * unitsPerPixel / 2;
        const halfH = engine.getRenderHeight() * unitsPerPixel / 2;

        const localRadius = mesh.getBoundingInfo().boundingSphere.radius;
        if (localRadius <= 0)
            return;

        const radius = placement.sizePx * unitsPerPixel / 2;
        mesh.scaling.setAll(radius / localRadius);

        const [sx, sy] = ANCHORS[placement.anchor];

        mesh.position.set(
            sx * (
                halfW -
                placement.marginXPx * unitsPerPixel -
                radius
            ),
            sy * (
                halfH -
                placement.marginYPx * unitsPerPixel -
                radius
            ),
            placement.distance *
                (this.scene.useRightHandedSystem ? -1 : 1)
        );
    }

    // private pinToCorner(mesh: Mesh, opts: pinOptions): void {
    //     const placement = { distance: 3, marginXPx: 24, marginYPx: 24, sizePx: 60, ...opts,};


    //     const eng = this.scene.getEngine();
    //     const w = eng.getRenderWidth();
    //     const h = eng.getRenderHeight();
    //     const aspect = w / h;
    //     const d = placement.distance;
    //     let halfH, halfW;
    //     halfH = d * Math.tan(this.camera.getCamera().fov / 2);
    //     halfW = halfH * aspect;
    //     const uPerPxX = (2 * halfW) / w;
    //     const uPerPxY = (2 * halfH) / h;
    //     const localRadius = mesh.getBoundingInfo().boundingSphere.radius;
    //     const s = (placement.sizePx * uPerPxY) / (2 * localRadius);
    //     mesh.scaling.setAll(s);

    //     const r = localRadius * s;

    //     const [sx, sy] = ANCHORS[placement.anchor];
    //     mesh.position.set(
    //         sx * (halfW - placement.marginXPx * uPerPxX - r),
    //         sy * (halfH - placement.marginYPx * uPerPxY - r),
    //         d * (this.scene.useRightHandedSystem ? -1 : 1)
    //     );
    // }

    public playerBadges(homePlayerIndex: number, localPlayer: string, otherPlayer: string): void {

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

    // Remove previous meshes and callback if called again.
        if (this.badgeMeshObserver) {
            this.scene.onBeforeRenderObservable.remove(this.badgeMeshObserver);
            this.badgeMeshObserver = null;
        }

        this.homeBadgeMesh?.dispose();
        this.otherBadgeMesh?.dispose();

        const look = this.materials.getLook();
        const homeIsPlayer1 = homePlayerIndex === 0;

        const homeMesh = this.board.createStyledMesh(homeIsPlayer1 ? look.moveStyle1 : look.moveStyle2, 0.3, "homeBadgeMesh");
        const otherMesh = this.board.createStyledMesh(homeIsPlayer1 ? look.moveStyle2 : look.moveStyle1, 0.3, "otherBadgeMesh");

        homeMesh.material = this.materials.getPlayerMaterial(homeIsPlayer1 ? 1 : 2);
        otherMesh.material = this.materials.getPlayerMaterial(homeIsPlayer1 ? 2 : 1);

        for (const mesh of [homeMesh, otherMesh]) {
            mesh.parent = this.badgeCamera;
            mesh.isPickable = false;
            mesh.layerMask = this.badgeLayerMask;
            mesh.renderingGroupId = 0;

            // Also handle shapes built from child meshes.
            for (const child of mesh.getChildMeshes()) {
                child.layerMask = this.badgeLayerMask;
                child.isPickable = false;
                child.renderingGroupId = 0;
            }
        }

        this.homeBadgeMesh = homeMesh;
        this.otherBadgeMesh = otherMesh;

        this.badgeMeshObserver =
            this.scene.onBeforeRenderObservable.add(() => {
                this.updateBadgeCamera();
                if (!this.topPlayerBadge || !this.midPlayerBadge)
                    return;

                this.pinToCorner(homeMesh, {
                    anchor: "top-left",
                    distance: 3,
                    marginXPx: 30 + this.topPlayerBadge.widthInPixels + 20,
                    marginYPx: 45,
                    sizePx: 60,
                });

                this.pinToCorner(otherMesh, {
                    anchor: "top-left",
                    distance: 3,
                    marginXPx: 30 + this.midPlayerBadge.widthInPixels + 20,
                    marginYPx: 245,
                    sizePx: 60,
                });

                //otherMesh.position.set(0, 0, 3 * (this.scene.useRightHandedSystem ? -1 : 1));

            });

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
   
        if (this.badgeMeshObserver) {
            this.scene.onBeforeRenderObservable.remove(this.badgeMeshObserver);
            this.badgeMeshObserver = null;
        }

        this.homeBadgeMesh?.dispose();
        this.otherBadgeMesh?.dispose();
        this.homeBadgeMesh = null;
        this.otherBadgeMesh = null;
        const mainCamera = this.camera.getCamera();

        this.scene.activeCameras = null;
        this.scene.activeCamera = mainCamera;
        this.scene.cameraToUseForPointers = mainCamera;

        this.badgeCamera.dispose();
        this.ui.dispose();
    }



}