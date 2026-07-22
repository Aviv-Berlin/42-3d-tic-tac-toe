import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials.ts";
import type { GridPosition } from "./GameState";


export class Board {
    scene: BABYLON.Scene;
    private N: number;
    private smallSize: number;
    private gap: number;
    private step: number;
    private offset: number;
    public materials: Materials;
    private spheres: BABYLON.Mesh [] = [];

    constructor(N: number, scene: BABYLON.Scene, materials: Materials)
	{
        this.scene = scene;
        this.materials = materials;
        this.N = N;
        this.gap = 0.02;
        this.smallSize = 2.5 / this.N;
        this.step = this.smallSize + this.gap;
        this.offset = (this.N - 1) / 2;

        this.createCubes();

    }

    private createCubes(): void {
        for (let x = 0; x < this.N; x++) {
            for (let y = 0; y < this.N; y++) {
                for (let z = 0; z < this.N; z++) {
                    const cube = BABYLON.MeshBuilder.CreateBox
						("smallCube", { size: this.smallSize },  this.scene);

                    cube.position = this.getPosition(x, y, z);
                    cube.material = this.materials.cube;
                }
            }
        }
    }

    private getPosition(x: number, y: number, z: number): BABYLON.Vector3 {
        return new BABYLON.Vector3
			((x - this.offset) * this.step, (y - this.offset) * this.step, (z - this.offset) * this.step);
    }

    putSphere(pos: GridPosition, material: BABYLON.Material): BABYLON.Mesh {
        const sphere = BABYLON.MeshBuilder.CreateSphere
            ("moveSphere", { diameter: this.smallSize * 0.7 }, this.scene);

        sphere.position = this.getPosition(pos.x, pos.y, pos.z);
        sphere.material = material;
        sphere.renderingGroupId = 1;

        this.spheres.push(sphere);
        return sphere;
    }

    reset() {
        for (const sphere of this.spheres)
            sphere.dispose();
    }

}


