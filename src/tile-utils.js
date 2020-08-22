import { WORLD_INFO } from "./worldInfo";

const TILES_WIDTH = WORLD_INFO.TILES_WIDTH;
const TILES_HEIGHT = WORLD_INFO.TILES_HEIGHT;
const TILETYPES = WORLD_INFO.TILETYPES;

export function getNeighborNodes(pivotNode) {
  const posY = pivotNode.pos.y;
  const posX = pivotNode.pos.x;
  const neighbourNodes = [9];

  if (posX == 0) {
    neighbourNodes[0] = -1;
    neighbourNodes[3] = -1;
    neighbourNodes[6] = -1;
  } else if (posX == TILES_WIDTH - 1) {
    neighbourNodes[2] = -1;
    neighbourNodes[5] = -1;
    neighbourNodes[8] = -1;
  }

  if (posY == 0) {
    neighbourNodes[0] = -1;
    neighbourNodes[1] = -1;
    neighbourNodes[2] = -1;
  } else if (posY == TILES_HEIGHT - 1) {
    neighbourNodes[6] = -1;
    neighbourNodes[7] = -1;
    neighbourNodes[8] = -1;
  }

  neighbourNodes[0] =
    neighbourNodes[0] != -1
      ? WORLD_INFO.WorldNodesMatrix[posY - 1][posX - 1]
      : -1;
  neighbourNodes[1] =
    neighbourNodes[1] != -1 ? WORLD_INFO.WorldNodesMatrix[posY - 1][posX] : -1;
  neighbourNodes[2] =
    neighbourNodes[2] != -1
      ? WORLD_INFO.WorldNodesMatrix[posY - 1][posX + 1]
      : -1;
  neighbourNodes[3] =
    neighbourNodes[3] != -1 ? WORLD_INFO.WorldNodesMatrix[posY][posX - 1] : -1;
  neighbourNodes[4] = pivotNode;
  neighbourNodes[5] =
    neighbourNodes[5] != -1 ? WORLD_INFO.WorldNodesMatrix[posY][posX + 1] : -1;
  neighbourNodes[6] =
    neighbourNodes[6] != -1
      ? WORLD_INFO.WorldNodesMatrix[posY + 1][posX - 1]
      : -1;
  neighbourNodes[7] =
    neighbourNodes[7] != -1 ? WORLD_INFO.WorldNodesMatrix[posY + 1][posX] : -1;
  neighbourNodes[8] =
    neighbourNodes[8] != -1
      ? WORLD_INFO.WorldNodesMatrix[posY + 1][posX + 1]
      : -1;

  return neighbourNodes;
}

export function getRandomNode(NodesMatrix) {
  const newPos = {
    y: Math.floor(Math.random() * TILES_HEIGHT),
    x: Math.floor(Math.random() * TILES_WIDTH),
  };

  return NodesMatrix[newPos.y][newPos.x];
}

export function resetcurrNodesMatrix() {
  WORLD_INFO.WorldNodesMatrix = [...Array(TILES_HEIGHT)].map((curr, yPos) =>
    [...Array(TILES_WIDTH)].map((curr, xPos) => {
      return {
        tileType: TILETYPES.untouched,
        pos: {
          x: xPos,
          y: yPos,
        },
      };
    })
  );
}

function writeTileNumbersOnCanvas(
  tilesArray = WORLD_INFO.WorldNodesMatrix,
  isError = false
) {
  if (isError) {
    document.getElementById("tile-canvas").innerHTML = tilesArray;
    return;
  }

  let element = document.getElementById("tile-canvas");

  var tiles = "";

  for (var yPos = 0; yPos < tilesArray.length; yPos++) {
    for (var xPos = 0; xPos < tilesArray[yPos].length; xPos++) {
      tiles += tilesArray[yPos][xPos].tileType;
    }
    tiles += "<br>";
  }

  element.innerHTML = tiles;
}
