import * as BABYLON from "@babylonjs/core";
import "./style.css";
import { Materials } from "./Materials.ts";
import { Board } from "./Board.ts";
import { GameUI } from "./GameUI.ts";
import { GameState } from "./GameState.ts";
import { InputManager } from "./InputManager.ts";
import { GameGraphics } from "./GameGraphics.ts";
import { CameraManager } from "./CameraManager.ts";


var N: number;
N = 4;
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement | null;

if (!canvas) {
  throw new Error("Canvas element #renderCanvas not found");
}

const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
const materials = new Materials(scene);
const camera = new CameraManager(scene, canvas);


const board = new Board(N, scene, materials);
const ui = new GameUI(scene);
const game = new GameState(N, ui);
const graphics = new GameGraphics(board, materials, N, game, camera);
const input = new InputManager(graphics);

engine.runRenderLoop(() => {
    scene.render();
});

input.registerEvents();

window.addEventListener("resize", () => {
  engine.resize();
})