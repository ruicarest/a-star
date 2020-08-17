import "./styles.css";
import { astar } from "./astar";
import { resize } from "./tilemanager";
import { WORLD_INFO } from "./worldInfo";

const TILES_WIDTH = WORLD_INFO.TILES_WIDTH;
const TILES_HEIGHT = WORLD_INFO.TILES_HEIGHT;
const BUILDINGS_NUMBER = WORLD_INFO.BUILDINGS_NUMBER;
const TREES_NUMBER = WORLD_INFO.TREES_NUMBER;
const TILETYPES = WORLD_INFO.TILETYPES;

var currNodesArray = WORLD_INFO.WorldNodesArray;

var buildingIndexes = [];

currNodesArray = [...Array(TILES_HEIGHT)].map((curr, yPos) =>
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

function resetCurrNodesArray() {
  currNodesArray = [...Array(TILES_HEIGHT)].map((curr, yPos) =>
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

function drawBuildings(buildingNumber = BUILDINGS_NUMBER) {
  //reset global buildings
  buildingIndexes = [];

  for (let i = 0; i < buildingNumber; i++) {
    let safetyTries = 50;
    let found = false;

    while (safetyTries >= 0 && !found) {
      let newNode = getRandomNode();

      if (newNode.tileType == TILETYPES.untouched) {
        newNode.tileType = TILETYPES.building;

        buildingIndexes.push(newNode);

        found = true;
      }

      safetyTries--;

      if (safetyTries == 0) {
        console.log("hey, couldn't find a spot for the next building!");
      }
    }
  }
}

function drawTrees(treesNumber = TREES_NUMBER) {
  for (let i = 0; i < treesNumber; i++) {
    let newTree = getRandomNode();

    while (newTree.tileType != TILETYPES.untouched) {
      newTree = getRandomNode();
    }

    newTree.tileType = TILETYPES.tree;
  }
}

//each road connects two buildings or meets another road
function drawRoads() {
  const map = astar();

  for (let i = 0; i < buildingIndexes.length; i++) {
    map.init(currNodesArray);

    var destination = i;

    while (destination == i) {
      destination = Math.floor(Math.random() * buildingIndexes.length);
    }

    var newSearch = map.search(
      buildingIndexes[i].pos,
      buildingIndexes[destination].pos
    );

    currNodesArray = drawRoad(currNodesArray, newSearch.path);
  }
}

function drawRoad(map, path) {
  let newMap = map;

  path.some((curr) => {
    let currentTile = newMap[curr.pos.y][curr.pos.x];

    if ([TILETYPES.road, TILETYPES.building].includes(currentTile.tileType)) {
      return true;
    }

    currentTile.tileType =
      currentTile.tileType == TILETYPES.untouched
        ? TILETYPES.road
        : currentTile.tileType;
    return false;
  });

  return newMap;
}

function getNeighborNodes(pivotNode) {
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
    neighbourNodes[0] != -1 ? currNodesArray[posY - 1][posX - 1] : -1;
  neighbourNodes[1] =
    neighbourNodes[1] != -1 ? currNodesArray[posY - 1][posX] : -1;
  neighbourNodes[2] =
    neighbourNodes[2] != -1 ? currNodesArray[posY - 1][posX + 1] : -1;
  neighbourNodes[3] =
    neighbourNodes[3] != -1 ? currNodesArray[posY][posX - 1] : -1;
  neighbourNodes[4] = pivotNode;
  neighbourNodes[5] =
    neighbourNodes[5] != -1 ? currNodesArray[posY][posX + 1] : -1;
  neighbourNodes[6] =
    neighbourNodes[6] != -1 ? currNodesArray[posY + 1][posX - 1] : -1;
  neighbourNodes[7] =
    neighbourNodes[7] != -1 ? currNodesArray[posY + 1][posX] : -1;
  neighbourNodes[8] =
    neighbourNodes[8] != -1 ? currNodesArray[posY + 1][posX + 1] : -1;

  return neighbourNodes;
}

function writeOnCanvas(tilesArray = currNodesArray, isError = false) {
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

function drawWater(nodeType, poolSize) {
  const waterArray = [];

  let newNode = getRandomNode();

  if (!newNode) {
    console.log("Warning first new node: ", newNode, currNodesArray, newPos);
  }

  findNextWaterNode(nodeType, poolSize, newNode, waterArray);
}

function getRandomNode() {
  const newPos = {
    y: Math.floor(Math.random() * TILES_HEIGHT),
    x: Math.floor(Math.random() * TILES_WIDTH),
  };

  let randomNode = currNodesArray[newPos.y][newPos.x];

  return randomNode;
}

function findNextWaterNode(nodeType, count, current, waterArray, safeTry = 10) {
  if (current.tileType !== nodeType) {
    waterArray.push(current);
    //BUG: pushing building nodes and turning them into water
    currNodesArray[current.pos.y][current.pos.x].tileType = nodeType;
  }

  if (count == 1) {
    return waterArray;
  }

  //Remove intruders
  var neighborNodes = getNeighborNodes(current).filter(
    (node) =>
      node !== -1 &&
      node.pos !== current.pos &&
      node.tileType !== nodeType &&
      node.tileType !== TILETYPES.building
  );

  //No neighborNode undiscovered left
  if (!Array.isArray(neighborNodes) || !neighborNodes.length) {
    let nextNode;

    if (waterArray.length < 2) {
      nextNode = getRandomNode();
    } else {
      nextNode = waterArray[Math.floor(Math.random() * waterArray.length)];
    }

    if (!nextNode) {
      console.log("Warning next known node: ", nextNode, waterArray, count);
    }

    return findNextWaterNode(
      nodeType,
      count,
      nextNode,
      waterArray,
      safeTry - 1
    );
  }

  neighborNodes.map((neighborNode) => {
    let neighborNodeNeighbours = getNeighborNodes(neighborNode);

    //Remove intruders
    let countWaterNeighbours = neighborNodeNeighbours.filter(
      (node) =>
        node !== -1 &&
        node.tileType == nodeType &&
        node.pos !== neighborNode.pos
    ).length;

    //lets get the one with highest score
    neighborNode.waterNeighbours = Math.max(
      countWaterNeighbours,
      neighborNode.waterNeighbours ? neighborNode.waterNeighbours : 0
    );
  });

  let newNode = neighborNodes.reduce((max = 0, node) =>
    max.waterNeighbours > node.waterNeighbours ? max : node
  );

  if (!newNode) {
    console.log("Warning new node: ", newNode, waterArray, count);
  }

  //move to next water node
  return findNextWaterNode(nodeType, count - 1, newNode, waterArray);
}

document.getElementById("loadNewMap").onclick = loadNewMap;

{
  setInterval(function () {
    loadNewMap();
  }, 1000);

  // loadNewMap();

  // resize();
}

function loadNewMap() {
  console.log("new search...");
  resetCurrNodesArray();

  drawBuildings();

  drawWater(TILETYPES.water, 20);
  drawWater(TILETYPES.water, 10);
  drawWater(TILETYPES.water, 20);

  drawWater(TILETYPES.grass, 6);
  drawWater(TILETYPES.grass, 8);
  drawWater(TILETYPES.grass, 6);
  drawWater(TILETYPES.grass, 8);
  drawWater(TILETYPES.grass, 6);
  drawWater(TILETYPES.grass, 18);

  drawTrees();

  drawRoads();

  //writeOnCanvas();

  WORLD_INFO.WorldNodesArray = currNodesArray;

  resize();
}
