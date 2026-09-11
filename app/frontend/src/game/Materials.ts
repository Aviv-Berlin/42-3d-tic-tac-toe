import * as BABYLON from "@babylonjs/core";
import type { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { CellState } from "../../../shared/game/Types";
import { playerStateToIndex } from "../../../shared/game/Utils";
import { LOOKS, Look, DEFAULT_PLAYER_COLORS} from "./LookSetting"


export class Materials {

    public readonly cube: StandardMaterial;
    public readonly buttonCube: StandardMaterial;
    public player1Material: StandardMaterial;
    public player2Material: StandardMaterial;
    public player1Preview: StandardMaterial;
    public player2Preview: StandardMaterial;
    private currentLookIndex = 0;
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
        const look = this.getLook();
        scene.clearColor = look.backgroundColor.clone();
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        const light2 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, -1, 0), scene);
		light.intensity = 0.7;
		light.diffuse = new BABYLON.Color3(1,1,1);
        light2.intensity = 0.7;

        this.cube = new StandardMaterial("cubeMat", scene);
        this.cube.diffuseColor = look.cubeColor.clone();
        this.cube.alpha = look.cubeAlpha;
        this.cube.needDepthPrePass = false;
        this.cube.disableDepthWrite = true;

        this.buttonCube = new StandardMaterial("buttonCube", scene);
        this.buttonCube.diffuseColor = BABYLON.Color3.FromHexString('#C44600');
        this.buttonCube.alpha = 1;

        this.player1Material = this.createPlayerMaterial(`player1Material`, look.player1Color, 1);
        this.player2Material = this.createPlayerMaterial(`player1Material`, look.player2Color, 1);
        this.player1Preview = this.createPlayerMaterial(`player1Material`, look.player1Color, look.previewAlpha);
        this.player2Preview = this.createPlayerMaterial(`player1Material`, look.player2Color, look.previewAlpha);

    }

    public applyCubeEdges(mesh: BABYLON.AbstractMesh, N: number, y: number): void {
        const look = this.getLook();
        mesh.enableEdgesRendering();
        mesh.edgesWidth = look.edgeWidth;
        switch (y) {
            case N - 1: mesh.edgesColor = look.edgeColor1.clone(); break;
            case 3: if (N === 5) mesh.edgesColor = look.edgeColor2.clone(); break;
            case 2: if (N === 5 || N === 4) mesh.edgesColor = look.edgeColor3.clone(); break;
            case 1: {
                if (N === 3)
                    mesh.edgesColor = look.edgeColor3.clone();
                else
                    mesh.edgesColor = look.edgeColor4.clone();
                break;
            }
            case 0: mesh.edgesColor = look.edgeColor5.clone(); break;
        } 
    }



    public applyLook(index: number): void {
        const look = LOOKS[index];

        if (!look)
            throw new Error(`Unknown look index: ${index}`);

        this.currentLookIndex = index;
        this.scene.clearColor.copyFrom(look.backgroundColor);
        this.cube.diffuseColor.copyFrom(look.cubeColor);
        this.cube.alpha = look.cubeAlpha;

        this.player1Material.diffuseColor.copyFrom(look.player1Color);
        this.player2Material.diffuseColor.copyFrom(look.player2Color);
        this.player1Preview.diffuseColor.copyFrom(look.player1Color);
        this.player2Preview.diffuseColor.copyFrom(look.player2Color);
        this.player1Preview.alpha = look.previewAlpha;
        this.player2Preview.alpha = look.previewAlpha;

    }

    public getPlayerMaterial(playerState: CellState): StandardMaterial {
        if (playerState === 1)
                return this.player1Material;
        return this.player2Material;
    }

    public getPreviewMaterial(playerState: CellState): StandardMaterial {
        if (playerState === 1)
                return this.player1Preview;
        return this.player2Preview;
    }

    private createPlayerMaterial(name: string, color: Color3, alpha: number): StandardMaterial {
        const material = new StandardMaterial(name, this.scene);
        material.diffuseColor = color.clone();
        material.alpha = alpha;
        if (alpha < 1) {
            material.needDepthPrePass = false;
            material.disableDepthWrite = true;
        }
        return material;
    }





    public getLook(): Look {
        return LOOKS[this.currentLookIndex];
    }

    public getLookIndex(): number {
        return this.currentLookIndex;
    }


}
