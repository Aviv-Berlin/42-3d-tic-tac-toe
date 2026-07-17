import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
import { Board } from "./Board";
import { GameUI } from "./GameUI";
import { GameState } from "./GameState";
import { InputManager } from "./InputManager";
import { GameGraphics } from "./GameGraphics";
import { CameraManager } from "./CameraManager";
import { AiPlayer } from "./AiPlayer"
import { LocalPlayer } from "./LocalPlayer"

export function createBabylonGame(canvas: HTMLCanvasElement, N: number, user: string, onExit: () => void) {
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  const materials = new Materials(scene);
  const camera = new CameraManager(scene, canvas);

  const board = new Board(N, scene, materials);
  const ui = new GameUI(scene);
  const graphics = new GameGraphics(board, materials, camera);
  const game = new GameState(N, ui, graphics, onExit);
  const ai = new AiPlayer("Ai1", game, graphics);
  const player = new LocalPlayer(user, game, graphics);
  const input = new InputManager(player);
  input.registerEvents();

  game.register(ai);
  game.register(player);
  game.startGame();

  engine.runRenderLoop(() => {
    scene.render();
  });


  const handleResize = () => {
    engine.resize();
  };

  window.addEventListener("resize", handleResize);

  return () => {
    game.dispose();
    input.unregisterEvents();
    window.removeEventListener("resize", handleResize);
    scene.dispose();
    engine.dispose();
  };
}
