import * as BABYLON from "@babylonjs/core";
import type { AbstractMesh, Scene, StandardMaterial, Mesh, Material } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
import { CameraManager } from "./CameraManager"
import { Materials } from "./Materials"

export class GameUI {

    private ui: GUI.AdvancedDynamicTexture;
    private playerNameCube: BABYLON.Mesh | null = null;
    private playerNameTexture: BABYLON.DynamicTexture | null = null;
    private instructions: GUI.TextBlock | null = null;
    private scene: Scene;
    private onExit: () => void;
    private materials: Materials;
    private gui3DManager: GUI.GUI3DManager;

    
    constructor(scene: Scene, onExit: () => void, materials: Materials) {
        this.scene = scene;
        this.onExit = onExit;
        this.materials = materials;
        this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.gui3DManager = new GUI.GUI3DManager(this.scene);
        this.createPlayerCube("test");
        this.displayInstructions();
        this.createExitCube();
    }
    private createExitCube() {
        const cubeSize = 2;
        const cube = BABYLON.MeshBuilder.CreateBox("exitCube", {size: cubeSize}, this.scene);
        cube.material = this.createTextMaterial("EXIT");
        cube.rotation = new BABYLON.Vector3(0, 0, 0);

        const babylonCamera = this.scene.activeCamera;
        if (!babylonCamera)
            throw new Error("No active camera found");
        const exitButton = new GUI.MeshButton3D(cube, "exitButton");
        this.gui3DManager.addControl(exitButton);

        if(exitButton.node)
            exitButton.node.parent = babylonCamera;
        exitButton.position = new BABYLON.Vector3(30, 14, 40);
        exitButton.onPointerUpObservable.add(()=> {this.onExit();});
    }

    private createTextMaterial(text: string): BABYLON.StandardMaterial {
        const texture = new BABYLON.DynamicTexture("textTexture",
            { width: 512, height: 512}, this.scene, true);

        texture.drawText(text,
            null,                   // center horizontally
            300,                    // vertical position
            "bold 150px Futura",
            "white",                // text color
            "#969696d0",              // background color
            true
        );

        const material = new BABYLON.StandardMaterial("textMaterial",  this.scene);

        material.diffuseTexture = texture;

        // Optional: makes the texture clearly visible without depending on light.
        //material.emissiveTexture = texture;

        return material;
    }

private createPlayerCube(initialPlayer: string): void {
        const babylonCamera = this.scene.activeCamera;

        if (!babylonCamera)
            throw new Error("No active camera found");

        const cubeSize = 4;
        this.playerNameCube = BABYLON.MeshBuilder.CreateBox(
            "playerNameCube", { size: cubeSize }, this.scene);

        this.playerNameTexture = new BABYLON.DynamicTexture("playerNameTexture",
            { width: 512, height: 512 }, this.scene, true);

        const material = new BABYLON.StandardMaterial("playerNameMaterial", this.scene);

        material.diffuseTexture = this.playerNameTexture;

        // Keep the text visible regardless of lighting.
        //material.disableLighting = true;

        this.playerNameCube.material = material;

        // Attach it to the camera.
        this.playerNameCube.parent = babylonCamera;

        // Same placement as EXIT, but on the left.
        this.playerNameCube.position.set(-28, 12, 40);

        this.playerNameCube.rotation.set(0, 0, 0);

        this.drawPlayerName(initialPlayer);
    }

    private drawPlayerName(player: string): void {
        if (!this.playerNameTexture)
            return;

        const fontSize = 720 /player.length;

        this.playerNameTexture.drawText(
            player,
            null,                          // center horizontally
            300,                           // vertical position
            `bold ${fontSize}px Futura`,
            "white",
            "#eee9e9",
            true,
            true
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
        this.instructions.text = "move with q,a,w,s,e,d, choose with Enter";
        this.ui.addControl(this.instructions);
    }

public playerTitle(player: string): void {
    this.drawPlayerName(player);
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
        this.gui3DManager.dispose();
    }

}