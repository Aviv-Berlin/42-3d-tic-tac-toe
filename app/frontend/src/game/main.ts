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
  const ui = new GameUI(scene, onExit, materials);
  const graphics = new GameGraphics(board, materials, camera);
  const game = new GameState(N, ui, graphics, onExit, 2);
  const ai = new AiPlayer("AiPlayer", game, graphics);
  const player = new LocalPlayer(user, game, graphics);
  //const guest = new LocalPlayer("guest", game, graphics);
  const input = new InputManager(game, scene, board);
  input.registerEvents();

  game.register(ai);
  game.register(player);
  //game.register(guest);
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
    ui.dispose();
    input.unregisterEvents();
    window.removeEventListener("resize", handleResize);
    scene.dispose();
    engine.dispose();
  };
}
