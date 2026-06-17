//import * as BABYLON from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";

export class Materials {
    public cube: StandardMaterial;
    public Player1Mat: StandardMaterial;
    public Player2Mat: StandardMaterial;
    public PreivewPlayer1Mat: StandardMaterial;
    public PreivewPlayer2Mat: StandardMaterial;

    constructor(scene: Scene)
    {
        this.cube = new StandardMaterial("cubeMat", scene);
        this.cube.diffuseColor = new Color3(0.67, 0.7, 0.71);
        this.cube.alpha = 0.35;
        this.cube.needDepthPrePass = true;

        this.Player1Mat = new StandardMaterial("Player1Mat", scene);
        this.Player1Mat.diffuseColor = new Color3(1, 0.16, 0.01);
       
        this.Player2Mat = new StandardMaterial("Player2Mat", scene);
        this.Player2Mat.diffuseColor = new Color3(0.01, 0.89, 1); 

        this.PreivewPlayer1Mat = new StandardMaterial("Preview1", scene);
        this.PreivewPlayer1Mat.diffuseColor = new Color3(1, 0.16, 0.01);
        this.PreivewPlayer1Mat.alpha = 0.2;

        this.PreivewPlayer2Mat = new StandardMaterial("Preview1", scene);
        this.PreivewPlayer2Mat.diffuseColor = new Color3(0.01, 0.89, 1);
        this.PreivewPlayer2Mat.alpha = 0.2;

    }


}