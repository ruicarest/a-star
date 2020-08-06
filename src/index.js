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

function testAspectRatio() {
  return TILES_NUMBER % TILES_WIDTH != 0 ? false : true;
}

function isFirstOnLine(index) {
  return index % TILES_WIDTH == 0 ? true : false;
}

function isLastOnLine(index) {
  return index % TILES_WIDTH == TILES_WIDTH - 1 ? true : false;
}

function isInFirstLine(index) {
  return index - TILES_WIDTH < 0 ? true : false;
}

function isInLastLine(index) {
  return index + TILES_WIDTH >= TILES_NUMBER ? true : false;
}

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

// 0 1 2
// 3 4 5
// 6 7 8
function getNeighboursTiles(index) {
  let neighboursTiles = [9];

  if (isFirstOnLine(index)) {
    neighboursTiles[0] = -1;
    neighboursTiles[3] = -1;
    neighboursTiles[6] = -1;
  } else if (isLastOnLine(index)) {
    neighboursTiles[2] = -1;
    neighboursTiles[5] = -1;
    neighboursTiles[8] = -1;
  }

  if (isInFirstLine(index)) {
    neighboursTiles[0] = -1;
    neighboursTiles[1] = -1;
    neighboursTiles[2] = -1;
  } else if (isInLastLine(index)) {
    neighboursTiles[6] = -1;
    neighboursTiles[7] = -1;
    neighboursTiles[8] = -1;
  }

  neighboursTiles[0] =
    neighboursTiles[0] != -1 ? mapTilesArray[index - TILES_WIDTH - 1] : -1;
  neighboursTiles[1] =
    neighboursTiles[1] != -1 ? mapTilesArray[index - TILES_WIDTH] : -1;
  neighboursTiles[2] =
    neighboursTiles[2] != -1 ? mapTilesArray[index - TILES_WIDTH + 1] : -1;
  neighboursTiles[3] = neighboursTiles[3] != -1 ? mapTilesArray[index - 1] : -1;
  neighboursTiles[4] = mapTilesArray[index];
  neighboursTiles[5] = neighboursTiles[5] != -1 ? mapTilesArray[index + 1] : -1;
  neighboursTiles[6] =
    neighboursTiles[6] != -1 ? mapTilesArray[index + TILES_WIDTH - 1] : -1;
  neighboursTiles[7] =
    neighboursTiles[7] != -1 ? mapTilesArray[index + TILES_WIDTH] : -1;
  neighboursTiles[8] =
    neighboursTiles[8] != -1 ? mapTilesArray[index + TILES_WIDTH + 1] : -1;

  return neighboursTiles;
}

// 0 1 2
// 3 4 5
// 6 7 8
function getNeighboursIndexes(index) {
  let neighboursIndexes = [9];

  if (isFirstOnLine(index)) {
    neighboursIndexes[0] = -1;
    neighboursIndexes[3] = -1;
    neighboursIndexes[6] = -1;
  } else if (isLastOnLine(index)) {
    neighboursIndexes[2] = -1;
    neighboursIndexes[5] = -1;
    neighboursIndexes[8] = -1;
  }

  if (isInFirstLine(index)) {
    neighboursIndexes[0] = -1;
    neighboursIndexes[1] = -1;
    neighboursIndexes[2] = -1;
  } else if (isInLastLine(index)) {
    neighboursIndexes[6] = -1;
    neighboursIndexes[7] = -1;
    neighboursIndexes[8] = -1;
  }

  neighboursIndexes[0] =
    neighboursIndexes[0] != -1 ? index - TILES_WIDTH - 1 : -1;
  neighboursIndexes[1] = neighboursIndexes[1] != -1 ? index - TILES_WIDTH : -1;
  neighboursIndexes[2] =
    neighboursIndexes[2] != -1 ? index - TILES_WIDTH + 1 : -1;
  neighboursIndexes[3] = neighboursIndexes[3] != -1 ? index - 1 : -1;
  neighboursIndexes[4] = index;
  neighboursIndexes[5] = neighboursIndexes[5] != -1 ? index + 1 : -1;
  neighboursIndexes[6] =
    neighboursIndexes[6] != -1 ? index + TILES_WIDTH - 1 : -1;
  neighboursIndexes[7] = neighboursIndexes[7] != -1 ? index + TILES_WIDTH : -1;
  neighboursIndexes[8] =
    neighboursIndexes[8] != -1 ? index + TILES_WIDTH + 1 : -1;

  return neighboursIndexes;
}

function getTilePositionVertical(index) {
  return Math.floor(index / TILES_WIDTH);
}

function getTilePositionHorizontal(index) {
  return Math.floor(index % TILES_WIDTH);
}

function drawRoad(map, path) {
  let newMap = map;

  path.forEach((curr) => {
    newMap[curr.pos.y][curr.pos.x].tileType =
      newMap[curr.pos.y][curr.pos.x].tileType == 0
        ? TILETYPES.road
        : newMap[curr.pos.y][curr.pos.x].tileType;
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

function drawBuildingsWithNeighbours(buildingNumber) {
  for (let i = 0; i < buildingNumber; i++) {
    let newLocation = { value: -1, yPos: 0, xPos: 0 };

    while (newLocation.value === -1) {
      newLocation.yPos = Math.floor(Math.random() * TILES_HEIGHT);
      newLocation.yPos = Math.floor(Math.random() * TILES_WIDTH);

      let buildingTiles = getNeighboursTiles(newLocation);

      if (!buildingTiles.find((buldingTile) => buldingTile > 0)) {
        getNeighboursIndexes(newLocation).forEach(
          (value) => (mapTilesArray[value] = TILETYPES.building)
        );

        buildingIndexes.push(newLocation);
      } else {
        newLocation.value = -1;
      }
    }
  }
}

function drawRoadsConnectingBuildings(count = 0) {
  if (count == buildingIndexes.length) {
    return;
  }

  drawRoad(
    buildingIndexes[count],
    buildingIndexes[Math.floor(Math.random() * buildingIndexes.length)]
  );

  drawRoadsConnectingBuildings(count + 1);
}

function drawBuildingsWithRoads(count, isFirst = true) {
  if (count == 0) return;

  if (isFirst) {
    buildingIndexes = [];
  }

  let newLocation = Math.floor(Math.random() * TILES_NUMBER);

  while (mapTilesArray[newLocation] != 0) {
    newLocation = Math.floor(Math.random() * TILES_NUMBER);
  }

  mapTilesArray[newLocation] = 2;

  if (!isFirst) {
    drawRoad(
      newLocation,
      buildingIndexes[Math.floor(Math.random() * buildingIndexes.length)]
    );
  }

  buildingIndexes.push(newLocation);

  drawBuildingsWithRoads(count - 1, false);
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
