import * as BABYLON from "@babylonjs/core";
import type { AbstractMesh, Scene, Mesh } from "@babylonjs/core";
import { Materials } from "./Materials";
import { GridPosition, CellState } from "../../../shared/game/Types"
import { TextCubeFactory } from "./TextCubeFactory";
import { MeshStyle, MESH_STYLE_SETTINGS } from "./LookSetting";

export class Board {
    scene: Scene;
    private N: number;
    private cellSize: number;
    private offset: number;
    public materials: Materials;
    private previewMesh: Mesh | null = null;
    private moveMeshes: Mesh [] = [];
    private boardMeshes: Mesh[] = [];
    private cubesShrink: boolean = false;
    private moveMeshesGrid: (AbstractMesh | null)[][][];
    private textCubeFactory: TextCubeFactory;

    constructor(N: number, scene: Scene, materials: Materials)
	{
        this.scene = scene;
        this.materials = materials;
        this.N = N;
        this.cellSize = this.materials.getLook().boardSize / this.N;
        this.offset = (this.N - 1) / 2;
        this.moveMeshesGrid = Array.from({ length: N }, () => Array.from({ length: N }, () => Array<AbstractMesh | null>(N).fill(null))); //intialize sphereMeshes to null
        this.textCubeFactory =  new TextCubeFactory(scene, materials);
    }

    private createStyledMesh(style: MeshStyle, size: number, name: string): BABYLON.Mesh {

        const settings = MESH_STYLE_SETTINGS[style];
        switch (settings.type) {

            case MeshStyle.Box:
                return BABYLON.MeshBuilder.CreateBox(name, { size }, this.scene);

            case MeshStyle.Sphere:
                return BABYLON.MeshBuilder.CreateSphere(name, { diameter: size * settings.diameterScale }, this.scene);

            case MeshStyle.Cylinders: { 
                const height =  size * settings.heightScale;
                const diameter = size * settings.diameterScale;
                const cylinderY = BABYLON.MeshBuilder.CreateCylinder(`${name}Y`, { height, diameter }, this.scene);
                const cylinderX = BABYLON.MeshBuilder.CreateCylinder(`${name}X`, { height, diameter }, this.scene);
                const cylinderZ = BABYLON.MeshBuilder.CreateCylinder(`${name}Z`, { height, diameter }, this.scene);
                cylinderX.rotation.x = Math.PI / 2;
                cylinderZ.rotation.z = Math.PI / 2;
                const merged = BABYLON.Mesh.MergeMeshes([cylinderY, cylinderX, cylinderZ], true);
                if (!merged)
                    throw new Error("Failed to merge cylinders");
                merged.name = name;
                return merged;
            }

            case MeshStyle.Plane: {
                const plane = BABYLON.MeshBuilder.CreatePlane( name, 
                    { width: size, height: size, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, this.scene);
                plane.rotation.x = settings.rotationX;
                return plane;
            }
        }
    }

    public createBoard(): void {
        const scale = this.cubesShrink ? 0.25 : 1;
        this.cellSize = this.materials.getLook().boardSize / this.N;
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];        

        for (let x = 0; x < this.N; x++) {
            for (let y = 0; y < this.N; y++) {
                for (let z = 0; z < this.N; z++) {               
                    const finalMesh = this.createStyledMesh(this.materials.getLook().boardStyle, this.cellSize, "boardMesh");
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
        this.cellSize = 2 / N;
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                for (let z = 0; z < N; z++) {
                    const finalMesh = BABYLON.MeshBuilder.CreateBox("smallCube", { size: this.cellSize },  this.scene);
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
                    const finalMesh = BABYLON.MeshBuilder.CreateBox("smallCube", { size: this.cellSize },  this.scene);
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
        const step = this.cellSize + this.materials.getLook().boardGap;;
        return new BABYLON.Vector3
			((x - this.offset) * step, (y - this.offset) * step, (z - this.offset) * step);
    }



    private createMoveMesh(pos: GridPosition, playerState: CellState, isPreview: boolean): Mesh {
        const look = this.materials.getLook();
        const mesh = this.createStyledMesh(look.moveStyle, this.cellSize * look.moveSizeScale, "moveMesh");
        mesh.position = this.getPosition(pos.x, pos.y, pos.z);
        mesh.material = isPreview ? this.materials.getPreviewMaterial(playerState) : this.materials.getPlayerMaterial(playerState);
        mesh.renderingGroupId = 0;
        mesh.isPickable = false;
        mesh.metadata = { gridPosition: { ...pos }, playerState, isPreview };
        return mesh;
    }

    public placeMoveMesh(pos: GridPosition, playerState: CellState, isPreview: boolean): Mesh {
        const mesh = this.createMoveMesh(pos, playerState, isPreview );
        if (!isPreview) {
            this.moveMeshes.push(mesh);
            this.moveMeshesGrid[pos.x][pos.y][pos.z] = mesh;
        }
        return mesh;
    }

    public refreshMoves(): void {
        for (let i = 0; i < this.moveMeshes.length; i++) {
            const oldMesh = this.moveMeshes[i];
            const pos = oldMesh.metadata?.gridPosition as GridPosition | undefined;
            const playerState = oldMesh.metadata?.playerState as CellState | undefined;
            const isPreview = oldMesh.metadata?.isPreview as boolean;
            if (!pos || playerState === undefined)
                continue;
            oldMesh.dispose();
            const newMesh = this.createMoveMesh( pos, playerState, isPreview);
            this.moveMeshes[i] = newMesh;
            this.moveMeshesGrid[pos.x][pos.y][pos.z] = newMesh;
        }
    }

    public reset(): void {
        this.hidePreview();
        for (const moveMesh of this.moveMeshes)
            moveMesh.dispose();
            this.moveMeshes = [];
            this.moveMeshesGrid = Array.from({ length: this.N }, () => Array.from( { length: this.N },
                () => Array<AbstractMesh | null>(this.N).fill(null)));
    }

    public getMoveMesh(pos: GridPosition): AbstractMesh | null {
        return this.moveMeshesGrid[pos.x][pos.y][pos.z];
    }
    public refreshTextCubes(): void {
        this.textCubeFactory.refreshLook();
    }

    public showPreview(pos: GridPosition, player: CellState): void {
        this.hidePreview();
        this.previewMesh =  this.placeMoveMesh(pos, player, true);
    }

    public hidePreview(): void {
        if (!this.previewMesh)
            return;

        this.previewMesh.dispose();
        this.previewMesh = null;
    }

    public refreshPreview(): void {
        if (!this.previewMesh)
            return;

        const pos = this.previewMesh.metadata?.gridPosition as GridPosition | undefined;
        const playerState = this.previewMesh.metadata?.playerState as CellState | undefined;
        if (!pos || playerState === undefined)
            return;
        this.previewMesh.dispose();
        this.previewMesh = this.createMoveMesh(pos, playerState, true);
    }


    public animateWin(winningPositions: GridPosition[] | null): void {
        if (!winningPositions) return;
		for (const position of winningPositions) {
            const sphere = this.getMoveMesh(position);
            if (sphere)
                sphere.scaling.setAll(1.5);
        }
    }
}


