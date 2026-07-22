import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
import { Board } from "./Board";
import { GameUI } from "./GameUI";
import { GameState } from "./GameState";
import { InputManager } from "./InputManager";
import { GameGraphics } from "./GameGraphics";
import { CameraManager } from "./CameraManager";
import { Player } from "./Player"
import { AiPlayer } from "./AIPlayer"
import { LocalPlayer } from "./LocalPlayer"
import { GameData } from "../types/game";


export function createBabylonGame(canvas: HTMLCanvasElement, gameData: GameData, onExit: () => void) {


  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);

  const materials = new Materials(scene);
  const camera = new CameraManager(scene, canvas);

  const board = new Board(gameData.size, scene, materials);
  const ui = new GameUI(scene, onExit, materials);
  const graphics = new GameGraphics(board, materials, camera);
  const game = new GameState(gameData.size, ui, graphics, onExit, 2);
  const player = new LocalPlayer(gameData.player1.username, game, graphics);
  let player2: Player;
  if (gameData.player2.type === "ai") 
    player2 = new AiPlayer(gameData.player2.username, game, graphics);
  else if (gameData.player2.type === "guest")
    player2 = new LocalPlayer(gameData.player2.username, game, graphics);
  else
    player2 = new AiPlayer("ai placeholder", game, graphics);
  const input = new InputManager(game, scene, board, camera);
  input.registerEvents();
  game.register(player);
  game.register(player2);
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
