import * as BABYLON from "@babylonjs/core";
import type { AbstractMesh, Scene, Mesh, Material } from "@babylonjs/core";
//import type { AbstractMesh, Scene, StandardMaterial, Mesh, Material } from "@babylonjs/core";
import { Materials } from "./Materials";
import { GridPosition } from "../../../shared/game/Types"
//import { GridPosition, CellState, PLAYER_STATES } from "../../../shared/game/Types"
import { TextCubeFactory } from "./TextCubeFactory";

export class Board {
    scene: Scene;
    private N: number;
    private smallSize: number;
    private gap: number;
    private step: number;
    private offset: number;
    public materials: Materials;
    private spheres: Mesh [] = [];
    private boardMeshes: Mesh[] = [];
    private cubesShrink: boolean = false;
    private sphereMeshes: (AbstractMesh | null)[][][];
    private textCubeFactory: TextCubeFactory;

    constructor(N: number, scene: Scene, materials: Materials)
	{
        this.scene = scene;
        this.materials = materials;
        this.N = N;
        this.gap = 0.02;
        this.smallSize = 2.5 / this.N;
        this.step = this.smallSize + this.gap;
        this.offset = (this.N - 1) / 2;
        this.sphereMeshes = Array.from({ length: N }, () => Array.from({ length: N }, () => Array<AbstractMesh | null>(N).fill(null))); //intialize sphereMeshes to null
        this.textCubeFactory =  new TextCubeFactory(scene, materials);
    }

    private createBoardMesh(boardStyle: number): BABYLON.Mesh {
        switch (boardStyle) {
            case 0:
            case 1:
            case 2:
                return BABYLON.MeshBuilder.CreateBox("smallCube", { size: this.smallSize },  this.scene);

            case 3:
                return BABYLON.MeshBuilder.CreateSphere("smallSphere", { diameter: this.smallSize * 1.1 }, this.scene);

            case 4: {
                const cylinder1 = BABYLON.MeshBuilder.CreateCylinder("smallCylinderY", { height: this.smallSize * 1.05, diameter: this.smallSize / 5}, this.scene);
                const cylinder2 = BABYLON.MeshBuilder.CreateCylinder("smallCylinderX", { height: this.smallSize * 1.05, diameter: this.smallSize / 5}, this.scene);
                const cylinder3 = BABYLON.MeshBuilder.CreateCylinder("smallCylinderZ", { height: this.smallSize * 1.05, diameter: this.smallSize / 5}, this.scene);

                cylinder2.rotation.x = BABYLON.Tools.ToRadians(90);
                cylinder3.rotation.z = BABYLON.Tools.ToRadians(90);
                const cylinders = BABYLON.Mesh.MergeMeshes([cylinder1, cylinder2, cylinder3], true);
                if (!cylinders) {
                    throw new Error("Failed to merge board cylinders");
                }
                cylinders.name = "cylindersCross";
                return cylinders;
            }

            case 5: {
                const plane = BABYLON.MeshBuilder.CreatePlane("smallPlane", {width: this.smallSize, height: this.smallSize, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, this.scene);
                plane.rotation.x = BABYLON.Tools.ToRadians(90);
                return plane;
            }

            case 6:
                return BABYLON.MeshBuilder.CreateBox("smallCube", { size: this.smallSize },  this.scene);

            default:
                throw new Error(`Unknown board style: ${boardStyle}`);
        }
    }

    public createBoard(looks: number): void {
        const scale = this.cubesShrink ? 0.25 : 1;
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];        

        for (let x = 0; x < this.N; x++) {
            for (let y = 0; y < this.N; y++) {
                for (let z = 0; z < this.N; z++) {               
                    const finalMesh = this.createBoardMesh(looks);
                    finalMesh.scaling.set(scale, scale, scale);
                    finalMesh.position = this.getPosition(x, y, z, true);
                    finalMesh.material = this.materials.cube;
                    finalMesh.metadata = { gridPosition: { x, y, z}};
                    this.boardMeshes.push(finalMesh);
                }
            }
        }
        this.toggleCubeEdges(this.materials.getLook().renderEdges);
    }

    public createBoardButton(N: number): void {
        this.smallSize = 2 / N;
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                for (let z = 0; z < N; z++) {
                    const finalMesh = BABYLON.MeshBuilder.CreateBox("smallCube", { size: this.smallSize },  this.scene);
                    finalMesh.position = this.getPosition(x, y, z, false);
                    finalMesh.material = this.materials.buttonCube;
                    finalMesh.enableEdgesRendering();
                    finalMesh.edgesWidth = 15.0;
                    finalMesh.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
                    finalMesh.metadata = { gridPosition: { x, y, z}};
                    this.boardMeshes.push(finalMesh);
                }
            }
        }
    }

    public createLogo(): void {
        const N = 3;
        this.smallSize = 2 / N;
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
                            size: this.smallSize, letterFace, renderEdges: true,  cubeColor: BABYLON.Color3.White(), ignoreLighting: true});
                    finalMesh.position = this.getPosition(x, y, z, false);
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
                    const finalMesh = BABYLON.MeshBuilder.CreateBox("smallCube", { size: this.smallSize },  this.scene);
                    finalMesh.position = this.getPosition(1, y, 1, false);
                    finalMesh.material = this.materials.buttonCube;
                    finalMesh.enableEdgesRendering();
                    finalMesh.edgesWidth = 15.0;
                    finalMesh.edgesColor = new BABYLON.Color4(1, 1, 1, 1);
                    finalMesh.metadata = { gridPosition: { x: 1, y, z: 1}};
                    this.boardMeshes.push(finalMesh);
        }
    }

    public toggleCubeEdges(renderEdges: boolean): void {
        for (const mesh of this.boardMeshes) {
            if (renderEdges)
                this.materials.applyCubeEdges(mesh);
            else
                mesh.disableEdgesRendering();
        }
    }

    public toggleCubeSize(): void {
        const scale = this.cubesShrink ? 1 : 0.25;
        for(const mesh of this.boardMeshes)
            mesh.scaling.set(scale, scale, scale);
        this.cubesShrink = !this.cubesShrink;
    }

    private getPosition(x: number, y: number, z: number, withGap: boolean): BABYLON.Vector3 {
        if (withGap) {
        return new BABYLON.Vector3
			((x - this.offset) * this.step, (y - this.offset) * this.step, (z - this.offset) * this.step);
        } else {
            return new BABYLON.Vector3
			    ((x - this.offset) * this.smallSize, (y - this.offset) * this.smallSize, (z - this.offset) * this.smallSize);
        }
    }

    putSphere(pos: GridPosition, material: Material, storeMove: boolean): Mesh {
        const sphere = BABYLON.MeshBuilder.CreateSphere("moveSphere", { diameter: this.smallSize * 0.7 }, this.scene);

        sphere.position = this.getPosition(pos.x, pos.y, pos.z, true);
        sphere.material = material;
        sphere.renderingGroupId = 0;
        sphere.isPickable = false;

        this.spheres.push(sphere);
        if (storeMove) // ignore preivew spheres
            this.sphereMeshes[pos.x][pos.y][pos.z] = sphere;
        return sphere;
    }

    reset() {
        for (const sphere of this.spheres)
            sphere.dispose();
    }

    public getSphere(pos: GridPosition): AbstractMesh | null {
        return this.sphereMeshes[pos.x][pos.y][pos.z];
    }
    public refreshTextCubes(): void {
        this.textCubeFactory.refreshLook();
    }
}


