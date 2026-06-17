import * as BABYLON from "@babylonjs/core";
import "./style.css";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement | null;

if (!canvas) {
  throw new Error("Canvas element #renderCanvas not found");
}

const engine = new BABYLON.Engine(canvas, true);

export const createBoard = (N: number): BABYLON.Scene => {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("camera",  Math.PI / 4, Math.PI / 3, 6, BABYLON.Vector3.Zero(), scene);

    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var cubeMat = new BABYLON.StandardMaterial("cubeMat", scene);
    cubeMat.diffuseColor = new BABYLON.Color3(0.67, 0.7, 0.71);
    cubeMat.alpha = 0.35;
    cubeMat.needDepthPrePass = true;

    var gap = 0.02;
    var smallSize = 2 / N;

    for (var x = 0; x < N; x++) {
        for (var y = 0; y < N; y++) {
            for (var z = 0; z < N; z++) {
                var cube = BABYLON.MeshBuilder.CreateBox("smallCube", { size: smallSize }, scene);

                
                var step = smallSize + gap;
                var offset = (N - 1) / 2;

                cube.position = new BABYLON.Vector3((x - offset) * step, (y - offset) * step, (z - offset) * step);
                cube.material = cubeMat;


            }
        }
    }

    return scene;
};

const board = createBoard(5);
engine.runRenderLoop(function() {
  board.render();

});

window.addEventListener("resize", () => {
  engine.resize();
});


    // var Player1Mat = new BABYLON.StandardMaterial("Player1Mat", scene);
    // Player1Mat.diffuseColor = new BABYLON.Color3(1, 0.16, 0.01);
    // Player1Mat.alpha = 1;
    // Player1Mat.needDepthPrePass = true;
    // var Player2Mat = new BABYLON.StandardMaterial("Player2Mat", scene);
    // Player2Mat.diffuseColor = new BABYLON.Color3(0.01, 0.89, 1);
    // Player2Mat.alpha = 1;
    // Player2Mat.needDepthPrePass = true;


	                // if (x == 2 && y == 1)
                // {
                //     var sphere = BABYLON.MeshBuilder.CreateSphere("SpherePlayer1", {diameter: smallSize * 0.7}, scene);
                //     sphere.position = new BABYLON.Vector3((x - offset) * step, (y - offset) * step, (z - offset) * step);
                //     sphere.material = Player1Mat;
                // }
                
                // if (z == 2 && y == 2 && x <= 1)
                // {
                //     var sphere2 = BABYLON.MeshBuilder.CreateSphere("SpherePlayer2", {diameter: smallSize * 0.7}, scene);
                //     sphere2.position = new BABYLON.Vector3((x - offset) * step, (y - offset) * step, (z - offset) * step);
                //     sphere2.material = Player2Mat;
                // }