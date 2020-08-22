import { WORLD_INFO } from "./worldInfo";
import { getRandomNode, getNeighborNodes } from "./tile-utils";

const TILETYPES = WORLD_INFO.TILETYPES;

export function drawGroupTiles(Type, poolSize) {
  var groupTilesArray = [];
  var count = poolSize;
  var nodeType = Type;

  var current = getRandomNode(WORLD_INFO.WorldNodesMatrix);

  findNextGroupTile();

  function findNextGroupTile(safeTry = 10) {
    if (current.tileType !== nodeType) {
      groupTilesArray.push(current);
      //BUG: pushing building nodes and turning them a group tile
      WORLD_INFO.WorldNodesMatrix[current.pos.y][
        current.pos.x
      ].tileType = nodeType;
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
        current = getRandomNode(WORLD_INFO.WorldNodesMatrix);
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
