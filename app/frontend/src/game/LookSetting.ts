import * as BABYLON from "@babylonjs/core";

export enum MeshStyle {
    Box = "box",
    Sphere = "sphere",
    Cylinders = "cylinders",
    Plane = "plane",
    Jacks = "jacks",
}

export const MESH_STYLE_SETTINGS = {
    [MeshStyle.Box]: {
        type: MeshStyle.Box,
    },

    [MeshStyle.Sphere]: {
        type: MeshStyle.Sphere,
        diameterScale: 1.4,
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

        [MeshStyle.Jacks]: {
        type: MeshStyle.Jacks,
        heightScale: 1.05,
        diameterScale: 0.2,
    },
} as const;

export interface Look {
    backgroundColor: BABYLON.Color4;
    cubeColor: BABYLON.Color3;
    cubeAlpha: number;
    textCubeColor?: BABYLON.Color3;
    textCubeAlpha?: number;
    edgeColor1: BABYLON.Color4;
    edgeColor2: BABYLON.Color4;
    edgeColor3: BABYLON.Color4;
    edgeColor4: BABYLON.Color4;
    edgeColor5: BABYLON.Color4;
    edgeWidth: number;
    renderEdges: boolean;
    textColor: BABYLON.Color3;
    player1Color: BABYLON.Color3;
    player2Color: BABYLON.Color3;
    player1Badge: BABYLON.Color3;
    player2Badge: BABYLON.Color3;
    vsColor: BABYLON.Color3;
    boardStyle: MeshStyle;
    moveStyle1: MeshStyle;
    moveStyle2: MeshStyle;
    moveOffset: number,
    boardSize: number,
    boardGap: number;
    moveSizeScale: number,
    previewAlpha: number,
}

export type PlayerColors = readonly [
    BABYLON.Color3,
    BABYLON.Color3
];

export const DEFAULT_PLAYER_COLORS: PlayerColors = [
    new BABYLON.Color3(1, 0.16, 0.01), // Player 1
    new BABYLON.Color3(0.01, 0.89, 1), // Player 2
];

export const LOOKS: Look[] = [
    //0 default
    {
        backgroundColor: new BABYLON.Color4(0.9, 0.9, 0.9),
        cubeColor: BABYLON.Color3.FromHexString('#C44600'),
        cubeAlpha: 0,
        edgeColor1: BABYLON.Color4.FromHexString("#C44600"),
        edgeColor2: BABYLON.Color4.FromHexString("#Ba4300"),
        edgeColor3: BABYLON.Color4.FromHexString("#b03f00"),
        edgeColor4: BABYLON.Color4.FromHexString("#a73c00"),
        edgeColor5: BABYLON.Color4.FromHexString("#9d3800"),
        edgeWidth: 2, // 3d grid lin width
        renderEdges: true, // 3d grid
        textColor: BABYLON.Color3.FromHexString('#C44600'), // Username, EXIT, etc
        player1Color: BABYLON.Color3.FromHexString('#ff8000'),
        player2Color: BABYLON.Color3.FromHexString('#004DB3'),
        player1Badge: BABYLON.Color3.FromHexString('#C44600'),
        player2Badge: BABYLON.Color3.FromHexString('#003d8d'),
        vsColor: BABYLON.Color3.FromHexString('#000000'),
        boardStyle: MeshStyle.Plane,
        moveStyle1: MeshStyle.Jacks,
        moveStyle2: MeshStyle.Sphere,
        moveOffset: 0.3,
        boardSize: 2.5,
        boardGap: 0,
        moveSizeScale: 0.6,
        previewAlpha: 0.2,
    },
    //1 this will be the dark look
    {
        backgroundColor: BABYLON.Color4.FromHexString('#282828FF'),
        cubeColor: BABYLON.Color3.FromHexString('#806A25'),
        cubeAlpha: 0,
        edgeColor1: BABYLON.Color4.FromHexString('#D05652FF'),
        edgeColor2: BABYLON.Color4.FromHexString("#D07152FF"),
        edgeColor3: BABYLON.Color4.FromHexString("#D08C52FF"),
        edgeColor4: BABYLON.Color4.FromHexString("#A87B3BFF"),
        edgeColor5: BABYLON.Color4.FromHexString("#806A25FF"),        
        edgeWidth: 4,
        renderEdges: true,
        textColor: BABYLON.Color3.FromHexString('#CACACA'),
        player1Color: BABYLON.Color3.FromHexString('#499ED3'),
        player2Color: BABYLON.Color3.FromHexString('#FF0085'),
        player1Badge: BABYLON.Color3.FromHexString('#3a7ba4'),
        player2Badge: BABYLON.Color3.FromHexString('#c00063'),
        vsColor: BABYLON.Color3.FromHexString('#CACACA'),
        boardStyle: MeshStyle.Plane,
        moveStyle1: MeshStyle.Sphere,
        moveStyle2: MeshStyle.Sphere,
        moveOffset: 0.3,
        boardSize: 2.5,
        boardGap: 0,
        moveSizeScale: 0.6,
        previewAlpha: 0.2,
    },
    //2 bubbles
    {
        backgroundColor: BABYLON.Color4.FromHexString('#22223bFF'),
        cubeColor: BABYLON.Color3.FromHexString('#abb3b5'),
        cubeAlpha: 0.4,
        edgeColor1: new BABYLON.Color4(0.6, 0.62, 0.63, 1),
        edgeColor2: BABYLON.Color4.FromHexString("#999EA1FF"),
        edgeColor3: BABYLON.Color4.FromHexString("#999EA1FF"),
        edgeColor4: BABYLON.Color4.FromHexString("#999EA1FF"),
        edgeColor5: BABYLON.Color4.FromHexString("#999EA1FF"),
        edgeWidth: 2,
        renderEdges: false,
        textColor: new BABYLON.Color3(0.85, 0.85, 0.85),
        player1Color: BABYLON.Color3.FromHexString('#b0571e'),
        player2Color: BABYLON.Color3.FromHexString('#968e24'),
        player1Badge: BABYLON.Color3.FromHexString('#974a1a'),
        player2Badge: BABYLON.Color3.FromHexString('#888120'),
        vsColor: new BABYLON.Color3(0.85, 0.85, 0.85),
        boardStyle: MeshStyle.Sphere, // sphere
        moveStyle1: MeshStyle.Sphere,
        moveStyle2: MeshStyle.Sphere,
        moveOffset: 0,
        boardSize: 2.5,
        boardGap: 0.00,
        moveSizeScale: 0.65,
        previewAlpha: 0.2,
    },
    //3 planes? maybe Tokyo Night?with refelective planes?
    // {
    //     backgroundColor: BABYLON.Color4.FromHexString('#544D59FF'),
    //     cubeColor: BABYLON.Color3.FromHexString('#abb3b5'),
    //     cubeAlpha: 0.4,
    //     edgeColor1: new BABYLON.Color4(0.60, 0.62, 0.63, 1),
    //     edgeColor2: BABYLON.Color4.FromHexString("#D9D9D9FF"),
    //     edgeColor3: BABYLON.Color4.FromHexString("#D9D9D9FF"),
    //     edgeColor4: BABYLON.Color4.FromHexString("#D9D9D9FF"),
    //     edgeColor5: BABYLON.Color4.FromHexString("#D9D9D9FF"),        
    //     edgeWidth: 2,
    //     renderEdges: false,
    //     textColor: new BABYLON.Color3(0.85, 0.85, 0.85),
    //     player1Color: BABYLON.Color3.FromHexString('#c064eb'),
    //     player2Color: BABYLON.Color3.FromHexString('#5de8ef'),
    //     player1Badge: BABYLON.Color3.FromHexString('#c064eb'),
    //     player2Badge: BABYLON.Color3.FromHexString('#5de8ef'),
    //     vsColor: BABYLON.Color3.FromHexString('#000000'),
    //     boardStyle: MeshStyle.Plane, // plane
    //     moveStyle1: MeshStyle.Sphere,
    //     moveStyle2: MeshStyle.Sphere,
    //     moveOffset: 0.3,
    //     boardSize: 2.5,
    //     boardGap: 0.05,
    //     moveSizeScale: 0.6,
    //     previewAlpha: 0.2,
    // },
];
