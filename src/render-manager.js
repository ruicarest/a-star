import { WORLD_INFO, THEME_TILEMAPPING } from "./worldInfo";
import { getNeighborNodes } from "./tile-utils";

const TILES_WIDTH = WORLD_INFO.TILES_WIDTH;
const THEME = WORLD_INFO.THEME;
const TILES_HEIGHT = WORLD_INFO.TILES_HEIGHT;
const TILE_TYPES = WORLD_INFO.TILETYPES;

let buffer = document.getElementById("map-canvas").getContext("2d");
let context = document.getElementById("map-canvas").getContext("2d");

context.canvas.width = TILES_WIDTH * 16;
context.canvas.height = TILES_HEIGHT * 16;

const tileSheet = new Image();

export function loadTileSheet(url = "TileSheet.png") {
  return new Promise((resolve) => {
    tileSheet.addEventListener("load", () => {
      resolve(tileSheet);
    });

    //starts the loading process
    tileSheet.src = url;
  });
}

export function renderMap(theme = THEME) {
  detailMap();
  for (let i = 0; i < TILES_HEIGHT; i++) {
    for (let j = 0; j < TILES_WIDTH; j++) {
      let tileInfo;

      const { tileType, tileSubType } = WORLD_INFO.WorldNodesMatrix[i][j];

      if (tileType == TILE_TYPES.road) {
        tileInfo = THEME_TILEMAPPING[theme].roadTiles.find((element) => {
          return element.id == tileSubType;
        });
      } else if (tileType == TILE_TYPES.untouched) {
        tileInfo = THEME_TILEMAPPING[theme].terrainTiles.find((element) => {
          return element.id == tileType;
        });
      } else {
        tileInfo = THEME_TILEMAPPING[theme].miscelaneous.find((element) => {
          return element.id == tileType;
        });
      }
      if (!tileInfo) {
        console.log("NO tile info: ", tileType);
      }

      let workdPosX = j * 16;
      let workdPosY = i * 16;

      if (tileInfo.backgroundID) {
        let backgroundTileInfo = THEME_TILEMAPPING[theme].terrainTiles.find(
          (element) => {
            return element.id == tileInfo.backgroundID;
          }
        );

        buffer.drawImage(
          tileSheet,
          backgroundTileInfo.column * 16,
          backgroundTileInfo.row * 16,
          16,
          16,
          workdPosX,
          workdPosY,
          16,
          16
        );
      }

      buffer.drawImage(
        tileSheet,
        tileInfo.column * 16,
        tileInfo.row * 16,
        16,
        16,
        workdPosX,
        workdPosY,
        16,
        16
      );
    }
  }

  context.drawImage(buffer.canvas, 0, 0);
}

export function resize() {
  context.canvas.width = TILES_WIDTH * 16;

  context.canvas.height = TILES_HEIGHT * 16;

  buffer.imageSmoothingEnabled = context.imageSmoothingEnabled = false;

  renderMap();
}

tileSheet.addEventListener("load", function () {
  //console.log("resize on load image");
});

function detailMap() {
  for (let i = 0; i < TILES_HEIGHT; i++) {
    for (let j = 0; j < TILES_WIDTH; j++) {
      let currentNode = WORLD_INFO.WorldNodesMatrix[i][j];

      if (currentNode.tileType == TILE_TYPES.road) {
        currentNode.tileSubType = getRoadTileIndex(
          WORLD_INFO.WorldNodesMatrix[i][j]
        );
      }
    }
  }
}

function getRoadTileIndex(node) {
  const Neighbors = getNeighborNodes(node);

  let subTypeCode;

  if (node.isBridge) {
    subTypeCode = 11;
    return subTypeCode;
  }

  let NeighborsNodesMap = "";
  //top
  NeighborsNodesMap =
    Neighbors[1].tileType == TILE_TYPES.road
      ? NeighborsNodesMap + "1"
      : NeighborsNodesMap + "0";
  //left
  NeighborsNodesMap =
    Neighbors[3].tileType == TILE_TYPES.road
      ? NeighborsNodesMap + "1"
      : NeighborsNodesMap + "0";
  //right
  NeighborsNodesMap =
    Neighbors[5].tileType == TILE_TYPES.road
      ? NeighborsNodesMap + "1"
      : NeighborsNodesMap + "0";
  //bottom
  NeighborsNodesMap =
    Neighbors[7].tileType == TILE_TYPES.road
      ? NeighborsNodesMap + "1"
      : NeighborsNodesMap + "0";

  switch (NeighborsNodesMap) {
    case "1001":
    case "0001":
    case "1000":
      subTypeCode = 0;
      break;
    case "0100":
    case "0010":
    case "0110":
      subTypeCode = 10;
      break;
    case "1100":
      subTypeCode = 9;
      break;
    case "0011":
      subTypeCode = 1;
      break;
    case "1010":
      subTypeCode = 7;
      break;
    case "0101":
      subTypeCode = 3;
      break;
    case "1111": //crossroads
      subTypeCode = 5;
      break;
    case "1011":
      subTypeCode = 2;
      break;
    case "1110":
      subTypeCode = 4;
      break;
    case "0111":
      subTypeCode = 6;
      break;
    case "1101":
      subTypeCode = 8;
      break;
    default:
      subTypeCode = 0;
  }

  return subTypeCode;
}
