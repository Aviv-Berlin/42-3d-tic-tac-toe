import * as BABYLON from "@babylonjs/core";
import type { AbstractMesh, Scene, StandardMaterial, Mesh, Material } from "@babylonjs/core";
import { Materials } from "./Materials";
import { GridPosition } from "./Types";

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
        this.createBoard(this.N, 1);

    }

    private createBoardMesh(looks: number): BABYLON.Mesh {
        switch (looks) {
            case 4:
                return BABYLON.MeshBuilder.CreateSphere("smallSphere", { diameter: this.smallSize * 1.1 }, this.scene);

            case 5: {
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

            default:
                return BABYLON.MeshBuilder.CreateBox("smallCube", { size: this.smallSize },  this.scene);
        }
    }

    public createBoard(N: number, looks: number): void {
        if (N === -1)
            N = this.N;
        const scale = this.cubesShrink ? 0.25 : 1;
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];        

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                for (let z = 0; z < N; z++) {
                    const finalMesh = this.createBoardMesh(looks);
                    finalMesh.scaling.set(scale, scale, scale);
                    finalMesh.position = this.getPosition(x, y, z);
                    finalMesh.material = this.materials.cube;
                    finalMesh.metadata = { gridPosition: { x, y, z}};
                    this.boardMeshes.push(finalMesh);
                }
            }
        }
    }

    public createStack(N: number, looks: number): void {
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];

        for (let y = 0; y < N; y++) {
            const finalMesh = this.createBoardMesh(looks);
            finalMesh.position = this.getPosition(1, y, 1);
            finalMesh.material = this.materials.cube;
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
        return new BABYLON.Vector3
			((x - this.offset) * this.step, (y - this.offset) * this.step, (z - this.offset) * this.step);
    }

    putSphere(pos: GridPosition, material: Material, storeMove: boolean): Mesh {
        const sphere = BABYLON.MeshBuilder.CreateSphere
            ("moveSphere", { diameter: this.smallSize * 0.7 }, this.scene);

        sphere.position = this.getPosition(pos.x, pos.y, pos.z);
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
}


