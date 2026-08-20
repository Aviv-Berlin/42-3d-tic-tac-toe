import * as BABYLON from "@babylonjs/core";

export enum MeshStyle {
    Box = "box",
    Sphere = "sphere",
    Cylinders = "cylinders",
    Plane = "plane",
}

export const MESH_STYLE_SETTINGS = {
    [MeshStyle.Box]: {
        type: MeshStyle.Box,
    },

    [MeshStyle.Sphere]: {
        type: MeshStyle.Sphere,
        diameterScale: 1.1,
    },

    [MeshStyle.Cylinders]: {
        type: MeshStyle.Cylinders,
        heightScale: 1.05,
        diameterScale: 0.2,
    },

    [MeshStyle.Plane]: {
        type: MeshStyle.Plane,
        rotationX: Math.PI / 2,
    },
} as const;

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
    boardStyle: MeshStyle;
    moveStyle: MeshStyle;
    textOnMove: boolean;
    boardSize: number,
    boardGap: number;
    moveSizeScale: number,
    previewAlpha: number,
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

    {
        backgroundColor: new BABYLON.Color4(1, 1, 1, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0,
        edgeColor: new BABYLON.Color4(0, 0, 0, 1),
        edgeWidth: 4,
        renderEdges: true,
        textColor: new BABYLON.Color3(0, 0, 0),
        boardStyle: MeshStyle.Box,
        moveStyle: MeshStyle.Sphere,
        textOnMove: true,
        boardSize: 2.5,
        boardGap: 0,
        moveSizeScale: 0.7,
        previewAlpha: 0.2,
    },

    {
        backgroundColor: new BABYLON.Color4(0, 0, 0, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 4,
        renderEdges: true,
        textColor: new BABYLON.Color3(1, 1, 1),
        boardStyle: MeshStyle.Box,
        moveStyle: MeshStyle.Sphere,
        textOnMove: false,
        boardSize: 2.5,
        boardGap: 0,
        moveSizeScale: 0.7,
        previewAlpha: 0.2,
    },

    {
        backgroundColor: new BABYLON.Color4(0.4, 0.4, 1, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0.12,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 2,
        renderEdges: false,
        textColor: new BABYLON.Color3(1, 1, 0),
        playerColors: [
            new BABYLON.Color3(0, 0, 0.8),   // Player 1 - blue
            new BABYLON.Color3(0, 0.8, 0), // Player 2 - green
            DEFAULT_PLAYER_COLORS[2],
            DEFAULT_PLAYER_COLORS[3],
        ],
        boardStyle: MeshStyle.Box,
        moveStyle: MeshStyle.Sphere,
        textOnMove: false,
        boardSize: 2.5,
        boardGap: 0.02,
        moveSizeScale: 0.7,
        previewAlpha: 0.2,
    },

    {
        backgroundColor: new BABYLON.Color4(0.33, 0.30, 0.35, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0.4,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 2,
        renderEdges: false,
        textColor: new BABYLON.Color3(0.85, 0.85, 0.85),
        boardStyle: MeshStyle.Sphere, // sphere
        moveStyle: MeshStyle.Box,      
        textOnMove: false,
        boardSize: 2.5,
        boardGap: 0.02,
        moveSizeScale: 0.7,
        previewAlpha: 0.2,
    },

    {
        backgroundColor: new BABYLON.Color4(0.33, 0.30, 0.35, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0.4,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 2,
        renderEdges: false,
        textColor: new BABYLON.Color3(0.85, 0.85, 0.85),
        boardStyle: MeshStyle.Cylinders,
        moveStyle: MeshStyle.Sphere,
        textOnMove: false,
        boardSize: 2.5,
        boardGap: 0.02,
        moveSizeScale: 0.7,
        previewAlpha: 0.2,
    },

    {
        backgroundColor: new BABYLON.Color4(0.33, 0.30, 0.35, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0.4,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 2,
        renderEdges: false,
        textColor: new BABYLON.Color3(0.85, 0.85, 0.85),
        boardStyle: MeshStyle.Plane, // plane
        moveStyle: MeshStyle.Box,
        textOnMove: false,
        boardSize: 2.5,
        boardGap: 0.05,
        moveSizeScale: 0.7,
        previewAlpha: 0.2,
    },

    {
        backgroundColor: new BABYLON.Color4(0.33, 0.30, 0.35, 1),
        cubeColor: new BABYLON.Color3(0.67, 0.7, 0.71),
        cubeAlpha: 0.4,
        edgeColor: new BABYLON.Color4(1, 1, 1, 1),
        edgeWidth: 2,
        renderEdges: false,
        textColor: new BABYLON.Color3(0.85, 0.85, 0.85),
        boardStyle: MeshStyle.Box, // default cube
        moveStyle: MeshStyle.Sphere,
        textOnMove: false,
        boardSize: 2.5,
        boardGap: 0.02,
        moveSizeScale: 0.7,
        previewAlpha: 0.2,
    },
];


