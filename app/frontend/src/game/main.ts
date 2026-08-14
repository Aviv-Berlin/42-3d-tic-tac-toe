import * as BABYLON from "@babylonjs/core";
import { Materials } from "./Materials";
import { Board } from "./Board";
import { GameUI } from "./GameUI";
import { GameServerConnection } from "./GameServerConnection";
import { InputManager } from "./InputManager";
import { GameGraphics } from "./GameGraphics";
import { CameraManager } from "./CameraManager";
import { LocalPlayer } from "./LocalPlayer"
import { GameData } from "../../../shared/game";
import { WsMessage } from "../../../shared/messages"
//import { createJoinGameMessage } from "../../../shared/messages"
import { getSocket } from "../services/websocket";

export function createBabylonGame(canvas: HTMLCanvasElement, gameData: GameData, onExit: () => void) {

  const instanceID = crypto.randomUUID().slice(0, 8);
  console.log(`[Babylon ${instanceID}] CREATE`);
  //all these are the visual elements - so running by the browser
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    const materials = new Materials(scene);
    const camera = new CameraManager(scene, canvas);
    const board = new Board(gameData.size, scene, materials);
    board.createBoard(1);
    const ui = new GameUI(scene, onExit, materials, board);
    const graphics = new GameGraphics(board, materials, camera);

  //const ws = new WebSocket(`ws://${window.location.hostname}:3001`);
  const ws = getSocket();

  ////
  if (!ws) return;
  const serverConnection = new GameServerConnection(gameData, ui, graphics, 2, ws, onExit);
  ui.register(serverConnection);
  const player = new LocalPlayer(gameData.player1.username, serverConnection, graphics);
  serverConnection.register(player);
  ////
  if (gameData.player2.type === "guest") {
    const guestPlayer = new LocalPlayer("guest",serverConnection, graphics);
    serverConnection.register(guestPlayer);
  }
///
  const handleGameMessage = (event: MessageEvent) => {
	const data: WsMessage = JSON.parse(event.data);
  console.log(`[Babylon ${instanceID}] Received message from server:`, data);
  serverConnection.handleMessage(data);
  }

  ws.addEventListener("message", handleGameMessage)

  //input manager is also frontend
  const input = new InputManager(serverConnection, scene, board, camera);
  input.registerEvents();


  engine.runRenderLoop(() => {
    scene.render();
  });


  const handleResize = () => {
    engine.resize();
  };

  window.addEventListener("resize", handleResize);

  let disposed = false;

  const cleanup = () => {
    if (disposed)
      return;
    console.log(`[Babylon ${instanceID}] CLEANUP`);
    disposed = true;

    console.log("Cleaning up Babylon game");

    input.unregisterEvents();
    window.removeEventListener("resize", handleResize);

    engine.stopRenderLoop();

	ws.removeEventListener("message", handleGameMessage)

    ui.dispose();
    scene.dispose();
    engine.dispose();
  };

  return cleanup;
}
