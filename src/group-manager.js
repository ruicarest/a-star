import { WORLD_INFO } from "./worldInfo";
import { getRandomNode, getNeighborNodes } from "./tile-utils";

const TILETYPES = WORLD_INFO.TILETYPES;

/*TODO: 
For each of the new tile 
Search on tilearray for tile with high number o neighbours
draw on that one
if tile has 8 neibours of same tile type marked as "surrounded" and skip
*/

export function drawGroupTiles(Type, poolSize) {
  var groupTilesArray = [];
  var possibleNextNodes = [];
  var count = poolSize;
  var nodeType = Type;
  var current;

  var WorldCopy = [...WORLD_INFO.WorldNodesMatrix];

  findNextGroupTile();

  function findNextGroupTile(safeTry = 10) {
    //INFINITE LOOP SAFETY CHECK
    if (safeTry == 1) {
      console.log("Safety - couldn't find all the tiles");
      return groupTilesArray;
    }

    if (count < 1) {
      return;
    }

    //FIRST NODE
    if (!current) {
      current = getRandomNode(WORLD_INFO.WorldNodesMatrix);

      if (
        current.tileType !== TILETYPES.untouched ||
        getValidNeighborNodesScore(current) < 3
      ) {
        current = false;
        return findNextGroupTile(safeTry - 1);
      }

      groupTilesArray.push(current);

      WORLD_INFO.WorldNodesMatrix[current.pos.y][
        current.pos.x
      ].tileType = nodeType;
      count--;
      return findNextGroupTile();
    }

    groupTilesArray.forEach((groupNode, index, array) => {
      getValidNeighborNodes(groupNode).forEach((node) => {
        node.validNeighborNodeScore = getValidNeighborNodesScore(node);
        if (!possibleNextNodes.find((element) => element.pos == node.pos)) {
          possibleNextNodes.push(node);
        }
      });
    });

    current = getOrganizedTiles();

    groupTilesArray.push(current);

    WORLD_INFO.WorldNodesMatrix[current.pos.y][
      current.pos.x
    ].tileType = nodeType;
    count--;
    return findNextGroupTile();
  }

  function getOrganizedTiles() {
    let indexToRemove = 0;
    let nextNode = -1;

    nextNode = possibleNextNodes.reduce((prev, curr, index) => {
      if (
        curr.validNeighborNodeScore < prev.validNeighborNodeScore &&
        curr.neighborValidNodes > 0
      ) {
        indexToRemove = index;
        return curr;
      } else {
        return prev;
      }
    });

    possibleNextNodes.splice(indexToRemove, 1);

    return nextNode;
  }

  function getSpiderTiles() {
    let index = Math.floor(Math.random() * possibleNextNodes.length);
    let nextNode = possibleNextNodes[index];

    possibleNextNodes.splice(index, 1);

    return nextNode;
  }

  //TODO: Improve this over here, it is not a great method
  function getUnorganizedTiles() {
    let bagOfIndexes = [];
    let nextNode = -1;

    nextNode = possibleNextNodes.reduce((prev, curr) => {
      if (
        curr.validNeighborNodeScore < prev.validNeighborNodeScore &&
        curr.neighborValidNodes > 0
      ) {
        return curr;
      } else {
        return prev;
      }
    });

    possibleNextNodes.find((element, index) => {
      if (element.validNeighborNodeScore == nextNode.validNeighborNodeScore) {
        bagOfIndexes.push(index);
        return true;
      }
      return false;
    });

    let randomMaxIndex =
      bagOfIndexes[Math.floor(Math.random(bagOfIndexes.length))];

    possibleNextNodes.splice(randomMaxIndex, 1);

    return possibleNextNodes[randomMaxIndex];
  }

  // valid
  function getValidNeighborNodes(nodeToEvaluate) {
    //get invalid neighbours
    var validNeighborNodes = getNeighborNodes(nodeToEvaluate).filter(
      (node) =>
        node !== -1 &&
        node.pos !== nodeToEvaluate.pos &&
        node.tileType !== nodeType &&
        node.tileType !== TILETYPES.building
    );

    return validNeighborNodes;
  }

  function getInvalidNeighborNodes(nodeToEvaluate) {
    //get valid neighbours
    var invalidNeighborNodes = getNeighborNodes(nodeToEvaluate).filter(
      (node) =>
        node === -1 ||
        node.pos === nodeToEvaluate.pos ||
        node.tileType === nodeType ||
        node.tileType === TILETYPES.building
    );

    return invalidNeighborNodes;
  }

  function getValidNeighborNodesScore(nodeToEvaluate) {
    let validScore = getValidNeighborNodes(nodeToEvaluate).length;
    //let invalidScore = getNeighborInvalidNodes(nodeToEvaluate).length;

    return validScore;
  }
}
