import { WORLD_INFO } from "./worldInfo";
import { getRandomNode } from "./tile-utils";

const TILETYPES = WORLD_INFO.TILETYPES;

export var buildingIndexes = [];

export function drawBuildings(buildingNumber = WORLD_INFO.BUILDINGS_NUMBER) {
  //reset global buildings
  buildingIndexes = [];

  for (let i = 0; i < buildingNumber; i++) {
    let safetyTries = 50;
    let found = false;

    while (safetyTries >= 0 && !found) {
      let newNode = getRandomNode(WORLD_INFO.WorldNodesMatrix);

      if (newNode.tileType == TILETYPES.untouched) {
        newNode.tileType = TILETYPES.building;

        buildingIndexes.push(newNode);

        found = true;
      }

      safetyTries--;

      if (safetyTries == 0) {
        console.log("WARNING: couldn't find a spot for the next building");
      }
    }
  }
}
