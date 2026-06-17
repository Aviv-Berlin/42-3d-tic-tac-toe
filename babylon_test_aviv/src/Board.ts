import * as BABYLON from "@babylonjs/core";


export class Board {
    scene: BABYLON.Scene;
    private N: number;
    private smallSize: number;
    private gap: number;
    private step: number;
    private offset: number;
    public player1Mat: BABYLON.StandardMaterial;
    public player2Mat: BABYLON.StandardMaterial;
    private cursorX = 2;
    private cursorY = 2;
    private cursorZ = 2;
    private previewSphere: BABYLON.Mesh;

    constructor(N: number, engine: BABYLON.Engine, canvas: HTMLCanvasElement)
	{
        this.N = N;
        this.gap = 0.02;
        this.smallSize = 2.5 / this.N;
        this.step = this.smallSize + this.gap;
        this.offset = (this.N - 1) / 2;

        this.scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera
			("camera", Math.PI / 4, Math.PI / 3, 6, BABYLON.Vector3.Zero(), this.scene);

        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight
			("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;

        this.player1Mat = new BABYLON.StandardMaterial("Player1Mat", this.scene);
        this.player1Mat.diffuseColor = new BABYLON.Color3(1, 0.16, 0.01);

        this.player2Mat = new BABYLON.StandardMaterial("Player2Mat", this.scene);
        this.player2Mat.diffuseColor = new BABYLON.Color3(0.01, 0.89, 1);

        this.createCubes();

        this.previewSphere = BABYLON.MeshBuilder.CreateSphere
            ("previewSphere", { diameter: this.smallSize * 0.7 }, this.scene);

        const previewMat = new BABYLON.StandardMaterial("previewMat", this.scene);
        previewMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        previewMat.alpha = 0.6;
        this.previewSphere.renderingGroupId = 1;


        this.previewSphere.material = previewMat;
        this.updatePreviewPosition();
    }

    private createCubes(): void {
        const cubeMat = new BABYLON.StandardMaterial("cubeMat", this.scene);
        cubeMat.diffuseColor = new BABYLON.Color3(0.67, 0.7, 0.71);
        cubeMat.alpha = 0.35;
        cubeMat.needDepthPrePass = true;

        for (let x = 0; x < this.N; x++) {
            for (let y = 0; y < this.N; y++) {
                for (let z = 0; z < this.N; z++) {
                    const cube = BABYLON.MeshBuilder.CreateBox
						("smallCube", { size: this.smallSize },  this.scene);

                    cube.position = this.getPosition(x, y, z);
                    cube.material = cubeMat;
                }
            }
        }
    }

    private getPosition(x: number, y: number, z: number): BABYLON.Vector3 {
        return new BABYLON.Vector3
			((x - this.offset) * this.step, (y - this.offset) * this.step, (z - this.offset) * this.step);
    }

    addMove(x: number, y: number, z: number, material: BABYLON.Material): void {
        const sphere = BABYLON.MeshBuilder.CreateSphere
            ("moveSphere", { diameter: this.smallSize * 0.7 }, this.scene);

        sphere.position = this.getPosition(x, y, z);
        sphere.material = material;
    }

    private updatePreviewPosition(): void {
        this.previewSphere.position = this.getPosition(
            this.cursorX,
            this.cursorY,
            this.cursorZ
        );
    }

    moveCursor(dx: number, dy: number, dz: number): void {
        this.cursorX += dx;
        this.cursorY += dy;
        this.cursorZ += dz;

        this.cursorX = Math.max(0, Math.min(this.N - 1, this.cursorX));
        this.cursorY = Math.max(0, Math.min(this.N - 1, this.cursorY));
        this.cursorZ = Math.max(0, Math.min(this.N - 1, this.cursorZ));

        this.updatePreviewPosition();
    }

    confirmMove(material: BABYLON.Material): void {
        this.addMove(this.cursorX, this.cursorY, this.cursorZ, material);
        this.previewSphere.setEnabled(false);
    }

    render(): void {
        this.scene.render();
    }
}


