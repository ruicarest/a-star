import { WORLD_INFO } from "./worldInfo";
import { getRandomNode } from "./tile-utils";

export function drawTrees(treesNumber = WORLD_INFO.TREES_NUMBER) {
  for (let i = 0; i < treesNumber; i++) {
    let newTree = getRandomNode(WORLD_INFO.WorldNodesMatrix);

    while (newTree.tileType != WORLD_INFO.TILETYPES.untouched) {
      newTree = getRandomNode(WORLD_INFO.WorldNodesMatrix);
    }

    newTree.tileType = WORLD_INFO.TILETYPES.tree;
  }
}
