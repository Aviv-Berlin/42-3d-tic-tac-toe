import * as BABYLON from "@babylonjs/core";

export interface Look {
    backgroundColor: BABYLON.Color4;
    cubeColor: BABYLON.Color3;
    cubeAlpha: number;
    textCubeColor?: BABYLON.Color3;
    textCubeAlpha?: number;
    edgeColor: BABYLON.Color4;
    edgeWidth: number;
    renderEdges: boolean;
    textColor: BABYLON.Color3;
    playerColors?: PlayerColors;
    boardStyle: number;
}

export type PlayerColors = readonly [
    BABYLON.Color3,
    BABYLON.Color3,
    BABYLON.Color3,
    BABYLON.Color3
];

export const DEFAULT_PLAYER_COLORS: PlayerColors = [
    new BABYLON.Color3(1, 0.16, 0.01), // Player 1
    new BABYLON.Color3(0.01, 0.89, 1), // Player 2
    new BABYLON.Color3(0.35, 1, 0.2),  // Player 3
    new BABYLON.Color3(0.9, 0.2, 1),   // Player 4
];

export const LOOKS: Look[] = [

    // 0 - old Look 1
    {
        backgroundColor: new BABYLON.Color4(1, 1, 1, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0,
        edgeColor: new BABYLON.Color4(0, 0, 0, 1),
        edgeWidth: 2,
        renderEdges: true,
        textColor: new BABYLON.Color3(0, 0, 0),
        boardStyle: 0,
    },

    // 1 - old Look 2
    {
        backgroundColor: new BABYLON.Color4(0, 0, 0, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 2,
        renderEdges: true,
        textColor: new BABYLON.Color3(1, 1, 1),
        boardStyle: 1,
    },

    // 2 - old Look 3
    {
        backgroundColor: new BABYLON.Color4(0.4, 0.4, 1, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0.12,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 2,
        renderEdges: false,
        textColor: new BABYLON.Color3(1, 1, 0),
        boardStyle: 2,
    },

    // 3 - old Look 4
    {
        backgroundColor: new BABYLON.Color4(0.33, 0.30, 0.35, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0.4,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 2,
        renderEdges: false,
        textColor: new BABYLON.Color3(0.85, 0.85, 0.85),
        boardStyle: 3, // sphere
    },

    // 4 - old Look 5
    {
        backgroundColor: new BABYLON.Color4(0.33, 0.30, 0.35, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0.4,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 2,
        renderEdges: false,
        textColor: new BABYLON.Color3(0.85, 0.85, 0.85),
        boardStyle: 4, // cylinders
    },

    // 5 - old Look 6
    {
        backgroundColor: new BABYLON.Color4(0.33, 0.30, 0.35, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0.4,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 2,
        renderEdges: false,
        textColor: new BABYLON.Color3(0.85, 0.85, 0.85),
        boardStyle: 5, // plane
    },

    // 6 - old Look 7
    {
        backgroundColor: new BABYLON.Color4(0.33, 0.30, 0.35, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0.4,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 2,
        renderEdges: false,
        textColor: new BABYLON.Color3(0.85, 0.85, 0.85),
        boardStyle: 6, // default cube
    },
];