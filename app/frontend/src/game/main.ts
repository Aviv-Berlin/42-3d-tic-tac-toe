import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
import { Board } from "./Board";
import { GameUI } from "./GameUI";
import { GameState } from "./GameState";
import { InputManager } from "./InputManager";
import { GameGraphics } from "./GameGraphics";
import { CameraManager } from "./CameraManager";

export function createBabylonGame(canvas: HTMLCanvasElement, N: number, user: string) {
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  const materials = new Materials(scene);
  const camera = new CameraManager(scene, canvas);

  const board = new Board(N, scene, materials);
  const ui = new GameUI(scene);
  const graphics = new GameGraphics(board, materials, camera);
  const game = new GameState(N, ui, user, "AI Player", graphics);
  const input = new InputManager(graphics, game);

  engine.runRenderLoop(() => {
    scene.render();
  });

  input.registerEvents();

  const handleResize = () => {
    engine.resize();
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    scene.dispose();
    engine.dispose();
  };
}
