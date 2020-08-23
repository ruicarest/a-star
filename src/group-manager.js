import { WORLD_INFO } from "./worldInfo";
import { getRandomNode, getNeighborNodes } from "./tile-utils";

const TILETYPES = WORLD_INFO.TILETYPES;

/*TODO: 
For each of the new tile 
Search on tilearray for tile with high number o neighbours
draw on that one
if tile has 8 neibours of same tile type marked as "surrounded" and skip
*/

/* add boundary nodes to a "bag" with a group node value 
  draw the tile on the node with the highest score
*/

export function drawGroupTiles2(Type, poolSize) {
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

export function drawGroupTiles(Type, poolSize) {
  var groupTilesArray = [];
  var count = poolSize;
  var nodeType = Type;

  var current = getRandomNode(WORLD_INFO.WorldNodesMatrix);

  findNextGroupTile();

  function findNextGroupTile(safeTry = 10) {
    //safety
    if (count == 1) {
      console.log("safety activated in findNextGroupTile()");
      return groupTilesArray;
    }

    if (current.tileType !== TILETYPES.untouched) {
      current = getRandomNode(WORLD_INFO.WorldNodesMatrix);
      return findNextGroupTile(count - 1);
    }

    //set tile node to group tiletype
    WORLD_INFO.WorldNodesMatrix[current.pos.y][
      current.pos.x
    ].tileType = nodeType;

    getNeighborNodes(current).forEach((node, index, theArray) => {
      if (node.tileType === nodeType) {
        node.neighborValidNodes--;
      }
    });

    var neighborNodes = getNeighborValidNodes(current);

    //set neighbor valid nodes number
    current.neighborValidNodes = neighborNodes.length;

    //add it to the group
    groupTilesArray.push(current);

    //No neighborNode undiscovered left
    if (!neighborNodes.length) {
      if (groupTilesArray.length < 2) {
        current = getRandomNode(WORLD_INFO.WorldNodesMatrix);
      } else {
        //get the node with highest number of nodes
        current = groupTilesArray.reduce((prev, curr) =>
          curr.neighborValidNodes < prev.neighborValidNodes &&
          curr.neighborValidNodes != 0
            ? curr
            : prev
        );
      }

      return findNextGroupTile(safeTry - 1);
    }

    //get the node with highest number of nodes
    var highValueGroupTile = groupTilesArray.reduce((prev, curr) => {
      return curr.neighborValidNodes > prev.neighborValidNodes ? curr : prev;
    });

    var highValueGroupTileNeighbours = getNeighborValidNodes(
      highValueGroupTile
    );

    current =
      highValueGroupTileNeighbours[
        Math.floor(Math.random() * highValueGroupTileNeighbours.length)
      ];

    if (!current) {
      console.log(
        WORLD_INFO.WorldNodesMatrix,
        getNeighborNodes(highValueGroupTile),
        "Warning new node: ",
        highValueGroupTileNeighbours,
        highValueGroupTile,
        current,
        groupTilesArray,
        count
      );
    }

    //move to next water node
    count--;
    return findNextGroupTile();
  }

  function getNeighborValidNodes(nodeToEvaluate) {
    //get valid neighbours
    var neighborNodes = getNeighborNodes(nodeToEvaluate).filter(
      (node) =>
        node !== -1 &&
        node.pos !== nodeToEvaluate.pos &&
        node.tileType !== nodeType &&
        node.tileType !== TILETYPES.building
    );

    return neighborNodes;
  }

  function getNeighborGroupScore(nodeToEvaluate) {
    //get valid neighbours
    var neighborNodes = getNeighborNodes(nodeToEvaluate).filter(
      (node) =>
        node === -1 ||
        node.pos === nodeToEvaluate.pos ||
        node.tileType === nodeType ||
        node.tileType === TILETYPES.building
    );

    return neighborNodes;
  }
}
