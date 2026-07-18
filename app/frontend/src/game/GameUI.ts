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

    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
}

export class GameUI {

    private ui: GUI.AdvancedDynamicTexture;
    private playerNameCube: BABYLON.Mesh | null = null;
    private playerNameTexture: BABYLON.DynamicTexture | null = null;
    private playerNameRow: BABYLON.TransformNode | null = null;
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
        this.playerTitle("test");
       // this.createPlayerCube("test");
        this.displayInstructions();
        this.createExitCube();
    }

    private createTextCubeRow(labels: readonly string[], options: TextCubeRowOptions): BABYLON.TransformNode {
        const cubeSize = options.cubeSize ?? 2;
        const gap = options.gap ?? 0.2;
        const anchor = options.anchor ?? "center";
        const backgroundColor = options.backgroundColor ?? "#f3ebeb";
        const textColor = options.textColor ?? "white";
        const fontFamily = options.fontFamily ?? "Futura, Arial, sans-serif";
        const root = new BABYLON.TransformNode(`${options.name}Root`, this.scene);

        if (options.parent)
            root.parent = options.parent;
        if (options.position) 
            root.position.copyFrom(options.position);

        const step = cubeSize + gap;
        const totalWidth = labels.length === 0 ? 0 : labels.length * cubeSize + (labels.length - 1) * gap;

        let firstCubeX = 0;

        switch (anchor) {
            case "left":
                firstCubeX = cubeSize / 2;
                break;

            case "right":
                firstCubeX = -totalWidth + cubeSize / 2;
                break;

            case "center":
                firstCubeX = -totalWidth / 2 + cubeSize / 2;
                break;
        }

        labels.forEach((label, index) => {
            const cubeName = `${options.name}Cube${index}`;
            const cube = BABYLON.MeshBuilder.CreateBox(
                cubeName,
                { size: cubeSize },
                this.scene
            );

            cube.parent = root;
            cube.position.x = firstCubeX + index * step;

            cube.material = this.createCubeTextMaterial(cubeName, label,
                backgroundColor, textColor, fontFamily);});

        return root;
    }

    private createCubeTextMaterial(id: string, text: string, backgroundColor: string,
        textColor: string, fontFamily: string): BABYLON.StandardMaterial {
        const textureSize = 512;
        const texture = new BABYLON.DynamicTexture(`${id}Texture`,
            { width: textureSize, height: textureSize}, this.scene, true);

        const context = texture.getContext() as CanvasRenderingContext2D;        
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, textureSize, textureSize);
        const maxTextWidth = textureSize * 0.75;
        let fontSize = 340;
        const minimumFontSize = 40;
        while (fontSize > minimumFontSize) {
            context.font = `bold ${fontSize}px ${fontFamily}`;
            const textWidth = context.measureText(text).width;
            if (textWidth <= maxTextWidth) {
                break;
            }
            fontSize -= 10;
        }
        context.font = `bold ${fontSize}px ${fontFamily}`;
        context.fillStyle = textColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, textureSize / 2, textureSize / 2);
        texture.update();
        const material = new BABYLON.StandardMaterial(`${id}Material`, this.scene);
        material.diffuseTexture = texture;
//        material.disableLighting = true;

        return material;
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
            "playerNameCube", { width: cubeSize, height: cubeSize, depth: cubeSize / 5 }, this.scene);

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
        const camera = this.scene.activeCamera;

        if (!camera) {
            throw new Error("No active camera found");
        }

        this.disposeTextCubeRow(this.playerNameRow);

        const letters = Array.from(player);

        this.playerNameRow = this.createTextCubeRow(
            letters,
            {
                name: "playerName",

                parent: camera,

                position: new BABYLON.Vector3(
                    -30, // left side
                    14,  // vertical position
                    40   // distance from camera
                ),

                cubeSize: 2,
                gap: 0.25,

                // The row starts on the left and grows right.
                anchor: "left",

                backgroundColor: "#969696",
                textColor: "white",
                fontFamily: "Futura, Arial, sans-serif"
            }
        );
    }

    private disposeTextCubeRow(
        row: BABYLON.TransformNode | null
    ): void {
        if (!row) {
            return;
        }

        const cubes = row.getChildMeshes();

        for (const cube of cubes) {
            const material = cube.material;

            cube.material = null;
            cube.dispose();

            if (material) {
                material.dispose(true, true);
            }
        }

        row.dispose();
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
        this.disposeTextCubeRow(this.playerNameRow);
        this.playerNameRow = null
        this.ui.dispose();
        this.gui3DManager.dispose();
    }

}