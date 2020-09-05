import _ from "lodash";
import { WORLD_INFO } from "./worldInfo";
import { buildingIndexes } from "./buildings-manager";
import { astar } from "./algorithms/astar";

const TILETYPES = WORLD_INFO.TILETYPES;

//each road connects two buildings or meets another road
export function drawRoads() {
  if (buildingIndexes.length < 2) {
    console.log("2+ buildings to draw roads");
    return;
  }
  const map = astar();

  for (let i = 0; i < buildingIndexes.length; i++) {
    map.init(WORLD_INFO.WorldNodesMatrix);

    var destination = i;

    while (destination == i) {
      destination = Math.floor(Math.random() * buildingIndexes.length);
    }

    var newSearch = map.search(
      buildingIndexes[i].pos,
      buildingIndexes[destination].pos
    );

    WORLD_INFO.WorldNodesMatrix = drawRoad(
      WORLD_INFO.WorldNodesMatrix,
      newSearch.path
    );
  }
}

function drawRoad(map, path) {
  //redundant
  let newMap = map;

  path.some((curr) => {
    let currentTile = newMap[curr.pos.y][curr.pos.x];

    if ([TILETYPES.road, TILETYPES.building].includes(currentTile.tileType)) {
      return true;
    }

    if (currentTile.tileType == TILETYPES.water) {
      currentTile.isBridge = true;
    }

    currentTile.tileType = TILETYPES.road;

    return false;
  });

  return newMap;
}
