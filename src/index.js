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

function getRandomNode() {
  const newPos = {
    y: Math.floor(Math.random() * TILES_HEIGHT),
    x: Math.floor(Math.random() * TILES_WIDTH),
  };

  let randomNode = currNodesArray[newPos.y][newPos.x];

  return randomNode;
}

function drawGroupTiles(Type, poolSize) {
  var groupTilesArray = [];
  var count = poolSize;
  var nodeType = Type;

  var current = getRandomNode();

  findNextGroupTile();

  function findNextGroupTile(safeTry = 10) {
    if (current.tileType !== nodeType) {
      groupTilesArray.push(current);
      //BUG: pushing building nodes and turning them a group tile
      currNodesArray[current.pos.y][current.pos.x].tileType = nodeType;
    }

    if (count == 1) {
      return groupTilesArray;
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
      if (groupTilesArray.length < 2) {
        current = getRandomNode();
      } else {
        current =
          groupTilesArray[Math.floor(Math.random() * groupTilesArray.length)];
      }

      if (!current) {
        console.log(
          "Warning next known node: ",
          current,
          groupTilesArray,
          count
        );
      }

      return findNextGroupTile(safeTry - 1);
    }

    neighborNodes.map((neighborNode) => {
      let neighborNodeNeighbours = getNeighborNodes(neighborNode);

      //Remove intruders
      let countSameTypeNeighbours = neighborNodeNeighbours.filter(
        (node) =>
          node !== -1 &&
          node.tileType == nodeType &&
          node.pos !== neighborNode.pos
      ).length;

      //lets get the one with highest score
      neighborNode.sameTypeNeighbours = Math.max(
        countSameTypeNeighbours,
        neighborNode.sameTypeNeighbours ? neighborNode.sameTypeNeighbours : 0
      );
    });

    current = neighborNodes.reduce((max = 0, node) =>
      max.sameTypeNeighbours > node.sameTypeNeighbours ? max : node
    );

    if (!current) {
      console.log("Warning new node: ", current, groupTilesArray, count);
    }

    //move to next water node
    count--;
    return findNextGroupTile();
  }
}

let isAutoGenerating = false;
let setIntervalID = null;

const autoFeatureBtn = document.getElementById("stop");
const loadNewMapBtn = document.getElementById("loadNewMap");

autoFeatureBtn.style.backgroundColor = "lightgreen";

loadNewMapBtn.onclick = loadNewMap;

autoFeatureBtn.onclick = () => {
  if (isAutoGenerating) {
    isAutoGenerating = false;
    clearInterval(setIntervalID);
    autoFeatureBtn.innerText = "Start Auto";
    autoFeatureBtn.style.backgroundColor = "lightgreen";
  } else {
    isAutoGenerating = true;
    setIntervalID = setInterval(function () {
      loadNewMap();
    }, 2000);

    autoFeatureBtn.innerText = "Stop Auto";
    autoFeatureBtn.style.backgroundColor = "#eb8888"; //lightred
  }
};

loadNewMap();

function loadNewMap() {
  const startTime = performance.now();

  console.log("new search...");
  resetCurrNodesArray();

  drawBuildings();

  //drawGroupTiles(TILETYPES.water, 2);
  drawGroupTiles(TILETYPES.water, 10);
  drawGroupTiles(TILETYPES.water, 20);
  // drawGroupTiles(TILETYPES.water, 20);
  // drawGroupTiles(TILETYPES.water, 10);
  // drawGroupTiles(TILETYPES.water, 20);

  // drawGroupTiles(TILETYPES.grass, 6);
  // drawGroupTiles(TILETYPES.grass, 8);
  // drawGroupTiles(TILETYPES.grass, 6);
  // drawGroupTiles(TILETYPES.grass, 8);
  // drawGroupTiles(TILETYPES.grass, 6);
  // drawGroupTiles(TILETYPES.grass, 18);

  // drawGroupTiles(TILETYPES.grass, 6);
  drawGroupTiles(TILETYPES.grass, 8);
  // drawGroupTiles(TILETYPES.grass, 6);
  // drawGroupTiles(TILETYPES.grass, 8);
  // drawGroupTiles(TILETYPES.grass, 6);
  // drawGroupTiles(TILETYPES.grass, 180);

  drawTrees();

  drawRoads();

  //writeOnCanvas();

  WORLD_INFO.WorldNodesArray = currNodesArray;

  resize();

  const duration = performance.now() - startTime;
  console.log(`someMethodIThinkMightBeSlow took ${duration}ms`);
}
