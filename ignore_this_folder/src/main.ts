import * as BABYLON from "@babylonjs/core";
import "./style.css";
import { Board } from "./Board";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement | null;

if (!canvas) {
  throw new Error("Canvas element #renderCanvas not found");
}

const engine = new BABYLON.Engine(canvas, true);

const board = new Board(3, engine, canvas);

engine.runRenderLoop(() => {
    board.render();
});


window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "q") {
        board.moveCursor(0, 1, 0);
    } else if (event.key === "a") {
        board.moveCursor(0, -1, 0);
    } else if (event.key === "w") {
        board.moveCursor(0, 0, 1);
    } else if (event.key === "s") {
        board.moveCursor(0, 0, -1);
    } else if (event.key === "e") {
        board.moveCursor(1, 0, 0);
    } else if (event.key === "d") {
        board.moveCursor(-1, 0, 0);
    } else if (event.key === "Enter") {
        board.confirmMove(board.player1Mat);
    }
});

window.addEventListener("resize", () => {
  engine.resize();
})