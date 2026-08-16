import * as BABYLON from "@babylonjs/core";
import type { AbstractMesh, Scene, Mesh, Material } from "@babylonjs/core";
//import type { AbstractMesh, Scene, StandardMaterial, Mesh, Material } from "@babylonjs/core";
import { Materials } from "./Materials";
import { GridPosition, CellState } from "../../../shared/game/Types"
import { TextCubeFactory } from "./TextCubeFactory";

export class Board {
    scene: Scene;
    private N: number;
    private smallSize: number;
    private offset: number;
    public materials: Materials;
    private moveMeshes: Mesh [] = [];
    private boardMeshes: Mesh[] = [];
    private cubesShrink: boolean = false;
    private sphereMeshes: (AbstractMesh | null)[][][];
    private textCubeFactory: TextCubeFactory;

    constructor(N: number, scene: Scene, materials: Materials)
	{
        this.scene = scene;
        this.materials = materials;
        this.N = N;
        this.smallSize = 2.5 / this.N;
        this.offset = (this.N - 1) / 2;
        this.sphereMeshes = Array.from({ length: N }, () => Array.from({ length: N }, () => Array<AbstractMesh | null>(N).fill(null))); //intialize sphereMeshes to null
        this.textCubeFactory =  new TextCubeFactory(scene, materials);
    }

    private createStyledMesh(style: number, size: number, name: string): BABYLON.Mesh {
        switch (style) {
            case 0:
            case 1:
            case 2:
            case 6:
                return BABYLON.MeshBuilder.CreateBox(name, { size }, this.scene);

            case 3:
                return BABYLON.MeshBuilder.CreateSphere(name, { diameter: size * 1.1 }, this.scene);

            case 4: {
                const cylinder1 = BABYLON.MeshBuilder.CreateCylinder(`${name}Y`, { height: size * 1.05, diameter: size / 5 }, this.scene);
                const cylinder2 = BABYLON.MeshBuilder.CreateCylinder(`${name}X`, { height: size * 1.05, diameter: size / 5 }, this.scene);
                const cylinder3 = BABYLON.MeshBuilder.CreateCylinder(`${name}X`, { height: size * 1.05, diameter: size / 5 }, this.scene);
                cylinder2.rotation.x = BABYLON.Tools.ToRadians(90);
                cylinder3.rotation.z = BABYLON.Tools.ToRadians(90);
                const merged = BABYLON.Mesh.MergeMeshes([cylinder1, cylinder2, cylinder3], true);
                if (!merged)
                    throw new Error("Failed to merge cylinders");
                merged.name = name;
                return merged;
            }

            case 5: {
                const plane = BABYLON.MeshBuilder.CreatePlane(name,
                    { width: size, height: size, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, this.scene);
                plane.rotation.x = BABYLON.Tools.ToRadians(90);
                return plane;
            }

            default:
                throw new Error(`Unknown mesh style: ${style}`);
        }
    }

    public createBoard(looks: number): void {
        const scale = this.cubesShrink ? 0.25 : 1;
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];        

        for (let x = 0; x < this.N; x++) {
            for (let y = 0; y < this.N; y++) {
                for (let z = 0; z < this.N; z++) {               
                    const finalMesh = this.createStyledMesh(looks, this.smallSize, "boardMesh");
                    finalMesh.scaling.set(scale, scale, scale);
                    finalMesh.position = this.getPosition(x, y, z);
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
                    finalMesh.position = this.getPosition(x, y, z);
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
                    finalMesh.position = this.getPosition(x, y, z);
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
                    finalMesh.position = this.getPosition(1, y, 1);
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

    private getPosition(x: number, y: number, z: number): BABYLON.Vector3 {
        const step = this.smallSize + this.materials.getLook().boardGap;;
        return new BABYLON.Vector3
			((x - this.offset) * step, (y - this.offset) * step, (z - this.offset) * step);
    }

    // putSphere(pos: GridPosition, material: Material, storeMove: boolean): Mesh {
    //     const moveMesh = this.createStyledMesh(this.materials.getLook().moveStyle,  this.smallSize * 0.7, "moveMesh");

    //     moveMesh.position = this.getPosition(pos.x, pos.y, pos.z);
    //     moveMesh.material = material;
    //     moveMesh.metadata = { gridPosition: {...pos } };
    //     moveMesh.renderingGroupId = 0;
    //     moveMesh.isPickable = false;

    //     this.moveMeshes.push(moveMesh);
    //     if (storeMove)
    //         this.sphereMeshes[pos.x][pos.y][pos.z] = moveMesh;
    //     return moveMesh;
    // }

    public createMoveMesh(pos: GridPosition, playerState: CellState, isPreview: boolean): Mesh {

        const mesh = this.createStyledMesh(this.materials.getLook().moveStyle, this.smallSize * 0.7, "moveMesh");
        mesh.position = this.getPosition(pos.x, pos.y, pos.z);
        mesh.material = isPreview ? this.materials.getPreviewMaterial(playerState) : this.materials.getPlayerMaterial(playerState);
        mesh.renderingGroupId = 0;
        mesh.isPickable = false;
        mesh.metadata = { gridPosition: { ...pos }, playerState, isPreview };
        return mesh;
    }

    public refreshMoves(): void {
        for (let i = 0; i < this.moveMeshes.length; i++) {
            const oldMesh = this.moveMeshes[i];
            const pos = oldMesh.metadata?.gridPosition as GridPosition | undefined;
            const playerState = oldMesh.metadata?.playerState as CellState | undefined;
            const isPreview = oldMesh.metadata?.isPreview as boolean | undefined;
            if (!pos || playerState === undefined)
                continue;
            oldMesh.dispose();
            this.moveMeshes[i] = this.createMoveMesh( pos, playerState, isPreview ?? false);
        }
    }

    reset() {
        for (const moveMesh of this.moveMeshes)
            moveMesh.dispose();
    }

    public getSphere(pos: GridPosition): AbstractMesh | null {
        return this.sphereMeshes[pos.x][pos.y][pos.z];
    }
    public refreshTextCubes(): void {
        this.textCubeFactory.refreshLook();
    }
}


