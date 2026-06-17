import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials.ts";


export class Board {
    scene: BABYLON.Scene;
    private N: number;
    private smallSize: number;
    private gap: number;
    private step: number;
    private offset: number;
    // public player1Mat: BABYLON.StandardMaterial;
    // public player2Mat: BABYLON.StandardMaterial;
    // private cursorX = 2;
    // private cursorY = 2;
    // private cursorZ = 2;
    // private previewSphere: BABYLON.Mesh;
    public materials: Materials;

    constructor(N: number, canvas: HTMLCanvasElement, scene: BABYLON.Scene, materials: Materials)
	{
        this.scene = scene;
        this.materials = materials;
        this.N = N;
        this.gap = 0.02;
        this.smallSize = 2.5 / this.N;
        this.step = this.smallSize + this.gap;
        this.offset = (this.N - 1) / 2;

        const camera = new BABYLON.ArcRotateCamera
			("camera", Math.PI / 4, Math.PI / 3, 6, BABYLON.Vector3.Zero(), this.scene);

        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight
			("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

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

    putSphere(x: number, y: number, z: number, material: BABYLON.Material): BABYLON.Mesh {
        const sphere = BABYLON.MeshBuilder.CreateSphere
            ("moveSphere", { diameter: this.smallSize * 0.7 }, this.scene);

        sphere.position = this.getPosition(x, y, z);
        sphere.material = material;
        sphere.renderingGroupId = 1;


        return sphere;
    }

    render(): void {
        this.scene.render();
    }
}


