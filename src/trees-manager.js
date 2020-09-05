import { WORLD_INFO } from "./worldInfo";
import { getRandomNode } from "./tile-utils";

export function drawTrees(treesNumber = WORLD_INFO.TREES_NUMBER) {
  for (let i = 0; i < treesNumber; i++) {
    let newTree = getRandomNode(WORLD_INFO.WorldNodesMatrix);
    let safeTry = 50;
    while (newTree.tileType != WORLD_INFO.TILETYPES.untouched && safeTry >= 0) {
      newTree = getRandomNode(WORLD_INFO.WorldNodesMatrix);
      safeTry--;
    }

    if (safeTry < 0) {
      console.log("WARNING: coudn't plant a tree...");
    } else {
      newTree.tileType = WORLD_INFO.TILETYPES.tree;
    }
  }
}
