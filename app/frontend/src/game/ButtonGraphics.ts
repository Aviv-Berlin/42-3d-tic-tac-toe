import * as BABYLON from "@babylonjs/core";
import type { AbstractMesh, Scene, Mesh } from "@babylonjs/core";
import { Materials } from "./Materials";
import { GridPosition, CellState } from "../../../shared/game/Types"
import { TextCubeFactory } from "./TextCubeFactory";
import { MeshStyle, MESH_STYLE_SETTINGS } from "./LookSetting";

export class ButtonGraphics {
    scene: Scene;
    private N: number;
    private cellSize: number;
    private offset: number;
    public materials: Materials;
    private boardMeshes: Mesh[] = [];
    private textCubeFactory: TextCubeFactory;

    constructor(N: number, scene: Scene, materials: Materials)
	{
        this.scene = scene;
        this.materials = materials;
        this.N = N;
        this.cellSize = this.materials.getLook().boardSize / this.N;
        this.offset = (this.N - 1) / 2;
        this.textCubeFactory =  new TextCubeFactory(scene, materials);
    }


    public createBoardButton(N: number): void {
        this.cellSize = 2 / N;
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                for (let z = 0; z < N; z++) {
                    const finalMesh = BABYLON.MeshBuilder.CreateBox("smallCube", { size: this.cellSize },  this.scene);
                    finalMesh.position = this.getPosition(x, y, z, 0);
                    finalMesh.material = this.materials.buttonCube;
                    finalMesh.enableEdgesRendering();
                    finalMesh.edgesWidth = 15.0;
                    finalMesh.edgesColor =  BABYLON.Color4.FromHexString("#e5e5e5");
                    finalMesh.metadata = { gridPosition: { x, y, z}};
                    this.boardMeshes.push(finalMesh);
                }
            }
        }
    }

    public createLogo(): void {
        const N = 3;
        this.cellSize = 2 / N;
        this.offset = (N - 1) / 2;
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                for (let z = 0; z < N; z++) {
                    let letter = "";
                    let letterFace = 6;

                    if (x === 0 && y === 2 && z === 0) {
                        letter = "T";
                         letterFace = 6;
                    }
                    if (x === 0 && y === 2 && z === 1) {
                        letter = "I";
                         letterFace = 4;
                    }
                    if (x === 0 && y === 2 && z === 2) {
                        letter = "C";
                         letterFace = 4;
                    }
                    if (x === 1 && y === 2 && z === 0) {
                        letter = "A";
                        letterFace = 1;
                    }
                    if (x === 2 && y === 2 && z === 0) {
                        letter = "C";
                        letterFace = 1;
                    }
                    if (x === 0 && y === 1 && z === 0) {
                        letter = "O";
                        letterFace = 1;
                    }
                    if (x === 0 && y === 0 && z === 0) {
                        letter = "E";
                        letterFace = 1;
                    }

                    const finalMesh = this.textCubeFactory.createTextCube(letter, {name: `logo-${x}-${y}-${z}`,
                            size: this.cellSize, letterFace, renderEdges: true,  cubeColor: BABYLON.Color3.White(), ignoreLighting: true});
                    finalMesh.position = this.getPosition(x, y, z, 0);
                    finalMesh.metadata = { gridPosition: { x, y, z } };
                    this.boardMeshes.push(finalMesh);
                }
            }
        }
    }



    public createStack(N: number): void {
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];

        for (let y = 0; y < N; y++) {
                    const finalMesh = BABYLON.MeshBuilder.CreateBox("smallCube", { size: this.cellSize },  this.scene);
                    finalMesh.position = this.getPosition(1, y, 1, 0);
                    finalMesh.material = this.materials.buttonCube;
                    finalMesh.enableEdgesRendering();
                    finalMesh.edgesWidth = 15.0;
                    finalMesh.edgesColor =  BABYLON.Color4.FromHexString("#e5e5e5");
                    finalMesh.metadata = { gridPosition: { x: 1, y, z: 1}};
                    this.boardMeshes.push(finalMesh);
        }
    }

    public createOnlineButton(type: string): void {
        const player1 = this.createPlayerLogo();
        player1.rotation.y = Math.PI / 2;
        const pos1 = new BABYLON.Vector3(1.5, 0 , 0);
        player1.position = pos1;
        const pos2 = new BABYLON.Vector3(-1.5, 0 , 0);
        const line = BABYLON.CreateGreasedLine("dottedLine", { points: [pos1, pos2]},
            { color: new BABYLON.Color3(0, 0, 0), width: 0.05, useDash: true,
                dashCount: 8, dashRatio: 0.2, }, this.scene);

        switch(type) {
            case "online":
            const player2 = this.createPlayerLogo();
            player2.position = pos2;
            player2.rotation.y = -(Math.PI / 2);
            break;

            case "ai":
            const computer = this.createComputerLogo();
            computer.position = pos2;
            computer.rotation.y = -(Math.PI / 2);
            break;

            case "local":
            line.dispose();
            player1.position = new BABYLON.Vector3(1, 0 , -0.2);
            const guest = this.createPlayerLogo();
            guest.position = new BABYLON.Vector3(-1, 0 , -0.2);
            guest.rotation.y = -(Math.PI / 2);
            const localComputer = this.createComputerLogo();
            localComputer.position = new BABYLON.Vector3(0, 0 , 0.3);
        }




    }

    private createComputerLogo(): BABYLON.TransformNode {
        const blackMaterial = new BABYLON.StandardMaterial("black", this.scene);
        blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        blackMaterial.alpha = 1;
        const whiteMaterial = new BABYLON.StandardMaterial("white", this.scene);
        whiteMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        whiteMaterial.alpha = 1;
        whiteMaterial.disableLighting = true;

        
        const computer = new BABYLON.TransformNode("computer", this.scene);

        const body = BABYLON.MeshBuilder.CreateBox("body", { width: 1.2, height: 0.8, depth: 0.2 },  this.scene);
        body.position = new BABYLON.Vector3(0, 0.5, 0);
        body.material = blackMaterial;
        body.parent = computer;

        const screen = BABYLON.MeshBuilder.CreateBox("screen", { width: 0.95, height: 0.67, depth: 0.1 },  this.scene);
        screen.position = new BABYLON.Vector3(0, 0.5, -0.07);
        screen.material = whiteMaterial;
        screen.parent = computer;

        const keyboard = BABYLON.MeshBuilder.CreateBox("keyboard", { width: 1.1, height: 0.4, depth: 0.2 },  this.scene);
        keyboard.position = new BABYLON.Vector3(0, -0.1, -0.2);
        keyboard.rotation.x = Math.PI / 2.3;
        keyboard.material = blackMaterial;
        keyboard.parent = computer;

        return computer;
    }

    private createPlayerLogo(): BABYLON.Mesh {
        const body = BABYLON.MeshBuilder.CreateSphere("body", { diameterX: 1.2, diameterY: 2, diameterZ: 0.3, slice: 0.5 }, this.scene);
        body.position = new BABYLON.Vector3(0, -0.5, 0);
        const head = BABYLON.MeshBuilder.CreateSphere("head", { diameter: 0.5 }, this.scene);
        head.position = new BABYLON.Vector3(0, 0.8, 0);
        const merged = BABYLON.Mesh.MergeMeshes([body,head], true);
            if (!merged)
                throw new Error("Failed to merge cylinders");
        merged.name = "player";
        const material = new BABYLON.StandardMaterial("buttonCube", this.scene);
        material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        material.emissiveColor = new BABYLON.Color3(0, 0, 0);
        material.alpha = 1;
        //material.disableLighting = true;
        merged.material = material;
        return merged
    } 

    public createNavbar(): void {
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];


        const finalMesh = BABYLON.MeshBuilder.CreateBox("smallCube", { size: 2.8 },  this.scene);
        finalMesh.position = new BABYLON.Vector3(0, 0, 0);
        const material = new BABYLON.StandardMaterial("buttonCube", this.scene);
        //material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        material.emissiveColor = BABYLON.Color3.FromHexString("#963400");
        //material.emissiveColor = new BABYLON.Color3(0, 0, 0);
        //material.diffuseColor = BABYLON.Color3.FromHexString("#e5e5e5");
        material.alpha = 1;
        material.disableLighting = true;
        finalMesh.material = material;
        // finalMesh.enableEdgesRendering();
        // finalMesh.edgesWidth = 15.0;
        // finalMesh.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
        finalMesh.metadata = { gridPosition: { x: 0, y: 0, z: 0}};
        this.boardMeshes.push(finalMesh);

    }

    public toggleCubeEdges(renderEdges: boolean): void {
        for (const mesh of this.boardMeshes) {
            if (renderEdges)
                this.materials.applyCubeEdges(mesh);
            else
                mesh.disableEdgesRendering();
        }
    }



    private getPosition(x: number, y: number, z: number, posOffset: number): BABYLON.Vector3 {
        const step = this.cellSize + this.materials.getLook().boardGap;;
        return new BABYLON.Vector3
			((x - this.offset) * step, (y - this.offset + posOffset) * step, (z - this.offset) * step);
    }





    public refreshTextCubes(): void {
        this.textCubeFactory.refreshLook();
    }

}


