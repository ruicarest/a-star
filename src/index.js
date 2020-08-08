import "./styles.css";
import { astar } from "./astar";

const TILES_NUMBER = 400;
const TILES_WIDTH = 20;
const TILES_HEIGHT = 20;
const BUILDINGS_NUMBER = 5;

const TILETYPES = {
  untouched: 0,
  road: 1,
  building: 2,
  tree: 3,
  water: 4,
};

var mapTilesArray = [...Array(TILES_HEIGHT)].map((curr, yPos) =>
  [...Array(TILES_WIDTH)].map((curr, xPos) => {
    return {
      tileType: 0,
      pos: {
        x: xPos,
        y: yPos,
      },
    };
  })
);

function resetmapTilesArray() {
  mapTilesArray = [...Array(TILES_HEIGHT)].map((curr, yPos) =>
    [...Array(TILES_WIDTH)].map((curr, xPos) => {
      return {
        tileType: 0,
        pos: {
          x: xPos,
          y: yPos,
        },
      };
    })
  );
}

function drawRoad(map, path) {
  let newMap = map;

  path.some((curr) => {
    let currentTile = newMap[curr.pos.y][curr.pos.x];

    if ([1, 2].includes(currentTile.tileType)) {
      return true;
    }

    currentTile.tileType =
      currentTile.tileType == 0 ? TILETYPES.road : currentTile.tileType;
    return false;
  });

  return newMap;
}

function drawBuildings(buildingNumber) {
  const buildingIndexes = [];

  for (let i = 0; i < buildingNumber; i++) {
    let newPos = { y: 0, x: 0 };

    let safetyTries = 50;
    let found = false;

    while (safetyTries >= 0 && !found) {
      newPos.y = Math.floor(Math.random() * TILES_HEIGHT);
      newPos.x = Math.floor(Math.random() * TILES_WIDTH);

      if (mapTilesArray[newPos.y][newPos.x].tileType == TILETYPES.untouched) {
        mapTilesArray[newPos.y][newPos.x].tileType = TILETYPES.building;

        buildingIndexes.push(newPos);

        found = true;
      }

      safetyTries--;

      if (safetyTries == 0) {
        alert("hey, couldn't build the map!");
      }
    }
  }
  return buildingIndexes;
}

function drawBuildingsWithRoadsAstar() {
  var newSearch, newCreatedMap;

  const map = astar();

  const buildingIndexes = drawBuildings(BUILDINGS_NUMBER);

  for (let i = 0; i < buildingIndexes.length; i++) {
    map.init(mapTilesArray);

    var destination = i;

    while (destination == i) {
      destination = Math.floor(Math.random() * buildingIndexes.length);
    }

    var newSearch = map.search(
      buildingIndexes[i],
      buildingIndexes[destination]
    );

    mapTilesArray = drawRoad(mapTilesArray, newSearch.path);
  }

  return newCreatedMap;
}

function writeOnCanvas(tilesArray = mapTilesArray, isError = false) {
  if (isError) {
    document.querySelector("#canvas").innerHTML = tilesArray;
    return;
  }

  let element = document.querySelector("#canvas");

  var tiles = "";

  for (var yPos = 0; yPos < tilesArray.length; yPos++) {
    for (var xPos = 0; xPos < tilesArray[yPos].length; xPos++) {
      tiles += tilesArray[yPos][xPos].tileType;
    }
    tiles += "<br>";
  }

  element.innerHTML = tiles;
}

//const isTestOk = testAspectRatio();
const isTestOk = true;
if (isTestOk) {
  setInterval(function () {
    resetmapTilesArray();
    drawBuildingsWithRoadsAstar();
    writeOnCanvas();
  }, 2000);
} else {
  writeOnCanvas("isTestOk failed", true);
}
