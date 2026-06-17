import * as BABYLON from "@babylonjs/core";
import "./style.css";
import { Materials } from "./Materials.ts";
import { Board } from "./Board.ts";
import { InputManager } from "./InputManager.ts";
import { PlacementManager } from "./PlacementManager.ts";

var N: number;
N = 4;
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement | null;

if (!canvas) {
  throw new Error("Canvas element #renderCanvas not found");
}

const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);
const materials = new Materials(scene);

const board = new Board(N, canvas, scene, materials);

const placement = new PlacementManager(board, materials, N);
const input = new InputManager(placement);

engine.runRenderLoop(() => {
    scene.render();

});


input.registerEvents();

window.addEventListener("resize", () => {
  engine.resize();
})