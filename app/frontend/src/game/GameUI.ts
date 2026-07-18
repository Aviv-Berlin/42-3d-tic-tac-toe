import { Scene, TransformNode, Vector3, MeshBuilder } from "@babylonjs/core/scene";
import * as GUI from "@babylonjs/gui";
import { CameraManager } from "./CameraManager"
import { Materials } from "./Materials"

export class GameUI {

    private ui: GUI.AdvancedDynamicTexture;
    private playerText: GUI.TextBlock | null = null;
    private instructions: GUI.TextBlock | null = null;
    private scene: Scene;
    private onExit: () => void;
    private camera;
    private materials;

    
    constructor(scene: Scene, onExit: () => void, camera: CameraManager, materials: Materials) {
        this.scene = scene;
        this.onExit = onExit;
        this.camera = camera;
        this.materials = materials;
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.displayPlayer();
        this.displayInstructions();
        const gui3DManager = this.createExitCube();
        //this.createExitButton();
    }
    private createExitCube(): GUI.GUI3DManager {
        const manager = new GUI.GUI3DManager(this.scene);
        const cube = MeshBuilder.CreateBox("exitCube", {size: 0.4}, this.scene);
        cube.material = this.materials.cube;
        const exitButton = new GUI.MeshButton3D(cube, "exitButton");
        manager.addControl(exitButton);
        exitButton.onPointerUpObservable.add(()=> {this.onExit();});
        return manager;
    }

    private displayPlayer () {
        this.playerText = new GUI.TextBlock();
        this.playerText.color = "gray";
        this.playerText.fontSize = 50;
        this.playerText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.playerText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.playerText.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.playerText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.playerText.paddingLeft = "40px";
        this.playerText.paddingTop = "40px";
        this.ui.addControl(this.playerText);
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
        this.instructions.text = "move with q,a,w,s,e,d, choose with Enter";
        this.ui.addControl(this.instructions);
    }

    public playerTitle(player: string) {
        if (this.playerText)
            this.playerText.text = player;
    }

    public displayWinner(winner: string): void {
        const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("winnerUI", true, this.scene);

        const winnerText = new GUI.TextBlock();

        winnerText.text = `${winner} wins!`;
        winnerText.color = "gray";
        winnerText.fontSize = 150;
        winnerText.top = "0px";
        winnerText.left = "0px";

        ui.addControl(winnerText);
    }

    private createExitButton(): void {
        const exitButton = GUI.Button.CreateSimpleButton("exitButton", "Exit");
        exitButton.width = "130px";
        exitButton.height = "45px";
        exitButton.color = "white";
        exitButton.background = "gray";
        exitButton.cornerRadius = 8;
        exitButton.thickness = 0;

        exitButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        exitButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        exitButton.top = "20px";
        exitButton.left = "-20px";

        exitButton.onPointerUpObservable.add(() => {
            this.onExit();
        });
        this.ui.addControl(exitButton);
    }
    public dispose(): void {
        this.ui.dispose();
    }

}