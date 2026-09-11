import * as BABYLON from "@babylonjs/core";
import type { AbstractMesh, Scene, Mesh } from "@babylonjs/core";
import { Materials } from "./Materials";
import { GridPosition, CellState } from "../../../shared/game/Types"
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
    private previewPulse: BABYLON.Animatable | null = null;

    constructor(N: number, scene: Scene, materials: Materials)
	{
        this.scene = scene;
        this.materials = materials;
        this.N = N;
        this.cellSize = this.materials.getLook().boardSize / this.N;
        this.offset = (this.N - 1) / 2;
        this.moveMeshesGrid = Array.from({ length: N }, () => Array.from({ length: N }, () => Array<AbstractMesh | null>(N).fill(null))); //intialize sphereMeshes to null
    }

    public createStyledMesh(style: MeshStyle, size: number, name: string): BABYLON.Mesh {

        const settings = MESH_STYLE_SETTINGS[style];
        switch (settings.type) {

            case MeshStyle.Box:
                return BABYLON.MeshBuilder.CreateBox(name, { size }, this.scene);

            case MeshStyle.Sphere:
                //return BABYLON.MeshBuilder.CreateSphere(name, { diameter: size * settings.diameterScale }, this.scene);
                const sphere = BABYLON.MeshBuilder.CreateSphere(name, { diameter: size * settings.diameterScale * 0.8 }, this.scene);
				//sphere.position.y = 1;
				return sphere;
            
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
                merged.metadata = { isCylinder: true };
                return merged;
            }

            case MeshStyle.Plane: {
                const plane = BABYLON.MeshBuilder.CreatePlane( name, 
                    { width: size, height: size, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, this.scene);
                plane.rotation.x = settings.rotationX;
				return plane;
            }

            	case MeshStyle.Jacks: {
                const heightX =  size * settings.heightScale; 
                const height =  size * settings.heightScale * 0.8;
                const diameter = size * settings.diameterScale;
                const posOffset = height / 1.5;
                const cylinderY = BABYLON.MeshBuilder.CreateCylinder(`${name}Y`, { height, diameter }, this.scene);
                const cylinderX = BABYLON.MeshBuilder.CreateCylinder(`${name}X`, { height: heightX, diameter }, this.scene);
                const cylinderZ = BABYLON.MeshBuilder.CreateCylinder(`${name}Z`, { height, diameter }, this.scene);
                const sphere1 = BABYLON.MeshBuilder.CreateSphere(`${name}1`, { diameter: size / 3  }, this.scene);
                const sphere2 = BABYLON.MeshBuilder.CreateSphere(`${name}2`, { diameter: size / 3 }, this.scene);
                const sphere3 = BABYLON.MeshBuilder.CreateSphere(`${name}3`, { diameter: size / 3 }, this.scene);
                const sphere4 = BABYLON.MeshBuilder.CreateSphere(`${name}4`, { diameter: size / 3 }, this.scene);
                sphere1.position = new BABYLON.Vector3(posOffset, 0, 0);
                sphere2.position = new BABYLON.Vector3(-posOffset, 0, 0);
                sphere3.position = new BABYLON.Vector3(0, posOffset, 0);
                sphere4.position = new BABYLON.Vector3(0, -posOffset, 0);

                cylinderX.rotation.x = Math.PI / 2;
                cylinderZ.rotation.z = Math.PI / 2;
                const merged = BABYLON.Mesh.MergeMeshes([cylinderY, cylinderX, cylinderZ, sphere1, sphere2, sphere3, sphere4], true);
                if (!merged)
                    throw new Error("Failed to merge cylinders");
                merged.name = name;
                merged.rotation.y = Math.PI / 4;
                merged.rotation.x = Math.PI / 4;
                merged.rotation.z = Math.PI / 4;
                return merged;
            }
        }
    }

    public async createBoard(animate: boolean): Promise<void> {
        const scale = this.cubesShrink ? 0.25 : 1;
        this.cellSize = this.materials.getLook().boardSize / this.N;
        this.boardMeshes.forEach(mesh => mesh.dispose());
        this.boardMeshes = [];
        const animations: Promise<void>[] = [];       

        for (let x = 0; x < this.N; x++) {
            for (let y = 0; y < this.N; y++) {
                for (let z = 0; z < this.N; z++) {               
                    const finalMesh = this.createStyledMesh(this.materials.getLook().boardStyle, this.cellSize, "boardMesh");
                    finalMesh.scaling.set(scale, scale, scale);
                    finalMesh.material = this.materials.cube;
                    finalMesh.metadata = { gridPosition: { x, y, z}};
                    this.boardMeshes.push(finalMesh);
                    if (this.materials.getLook().renderEdges)
                        this.materials.applyCubeEdges(finalMesh, this.N, y);
                    else
                        finalMesh.disableEdgesRendering();
                    if (!animate)
                        finalMesh.position = this.getPosition(x, y, z, 0);
                    else {
                        const endPos = this.getPosition(x, y, z, 0);
                        const startPos = endPos.add(new BABYLON.Vector3(0,20,0));
                        const easing = new BABYLON.CubicEase();
                        easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
                        const animationPromise = new Promise<void>((resolve) => {
                        BABYLON.Animation.CreateAndStartAnimation("finalMesh", finalMesh, "position",
                            60, 30, startPos, endPos, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT, easing, resolve)});
                        animations.push(animationPromise);
                        await new Promise(resolve => setTimeout(resolve, 30));
                    }
                }
            }
        }
        await Promise.all(animations);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }



    // public toggleCubeEdges(renderEdges: boolean): void {
    //     for (const mesh of this.boardMeshes) {
    //         if (renderEdges)
    //             this.materials.applyCubeEdges(mesh, this.N, );
    //         else
    //             mesh.disableEdgesRendering();
    //     }
    // }

    public toggleCubeSize(): void {
        const scale = this.cubesShrink ? 1 : 0.25;
        for(const mesh of this.boardMeshes)
            mesh.scaling.set(scale, scale, scale);
        this.cubesShrink = !this.cubesShrink;
    }

    private getPosition(x: number, y: number, z: number, posOffset: number): BABYLON.Vector3 {
        const step = this.cellSize + this.materials.getLook().boardGap;;
        return new BABYLON.Vector3
			((x - this.offset) * step, (y - this.offset + posOffset) * step, (z - this.offset) * step);
    }



    public createMoveMesh(pos: GridPosition, playerState: CellState, isPreview: boolean): Mesh {
        const look = this.materials.getLook();
        let mesh: BABYLON.Mesh;
        if (playerState === CellState.Player1)
            mesh = this.createStyledMesh(look.moveStyle1, this.cellSize * look.moveSizeScale, "moveMesh");
        else {
            mesh = this.createStyledMesh(look.moveStyle2, this.cellSize * look.moveSizeScale, "moveMesh");        
        }

        mesh.position = this.getPosition(pos.x, pos.y, pos.z, look.moveOffset);
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


    public showPreview(pos: GridPosition, player: CellState): void {
        this.hidePreview();
        this.previewMesh =  this.placeMoveMesh(pos, player, true);
        this.startPreviewPulse(player);
    }

    public hidePreview(): void {
        if (!this.previewMesh)
            return;

        if (this.previewPulse) {
            this.previewPulse.stop();
            this.previewPulse = null;
        }

        this.previewMesh.dispose();
        this.previewMesh = null;
    }

    private startPreviewPulse(player: CellState): void {
        const material = this.materials.getPreviewMaterial(player);
        const previewAlpha = this.materials.getLook().previewAlpha;
        material.alpha = previewAlpha;

        const animation = new BABYLON.Animation("previewPulse", "alpha", 60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        animation.setKeys([{ frame: 0,   value: previewAlpha },
            // stay at preview opacity for ~1.8 seconds
            { frame: 40, value: previewAlpha },
            // quickly become fully opaque
            { frame: 45, value: 1 },
            // stay fully opaque for ~0.2 seconds
            { frame: 55, value: 1 },
            // return to preview opacity
            { frame: 60, value: previewAlpha },]);

        this.previewPulse = this.scene.beginDirectAnimation(material, [animation], 0, 120, true);
    }

    public refreshPreview(): void {
        if (!this.previewMesh)
            return;

        const pos = this.previewMesh.metadata?.gridPosition as GridPosition | undefined;
        const playerState = this.previewMesh.metadata?.playerState as CellState | undefined;

        if (!pos || playerState === undefined)
            return;

        this.showPreview(pos, playerState);
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


