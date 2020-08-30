import _ from "lodash";
import { WORLD_INFO } from "./worldInfo";
import { buildingIndexes } from "./buildings-manager";

const TILETYPES = WORLD_INFO.TILETYPES;

const doubleCost = [TILETYPES.untouched];
const tripleCost = [TILETYPES.grass];

const walls = [TILETYPES.tree, TILETYPES.water];

function isWall(node) {
  return walls.includes(node.tileType);
}

function findNodeCost(node) {
  let cost = 1;

  if (doubleCost.includes(node.tileType)) {
    cost = 2;
  }
  if (tripleCost.includes(node.tileType)) {
    cost = 3;
  }

  return cost;
}

function astar() {
  var grid;

  function init(map) {
    grid = map;

    for (var yPos = 0; yPos < grid.length; yPos++) {
      for (var xPos = 0; xPos < grid[yPos].length; xPos++) {
        grid[yPos][xPos].f = 10000;
        grid[yPos][xPos].g = 0;
        grid[yPos][xPos].h = 0;
        grid[yPos][xPos].parent = null;
        grid[yPos][xPos].id = _.uniqueId("node");
        grid[yPos][xPos].isWall = isWall(grid[yPos][xPos]);
        grid[yPos][xPos].cost = findNodeCost(grid[yPos][xPos]);
      }
    }
  }

  function search(startPos, endPos) {
    if (!grid) {
      return alert("Please run init first");
    }

    var openList = [];
    var closedList = [];
    openList.push(grid[startPos.y][startPos.x]);

    while (openList.length > 0) {
      // Grab the lowest f(x) to process next
      var lowInd = 0;
      for (var i = 0; i < openList.length; i++) {
        if (openList[i].f < openList[lowInd].f) {
          lowInd = i;
        }
      }
      var currentNode = openList[lowInd];

      // End case -- result has been found, return the traced path
      if (currentNode.pos.x == endPos.x && currentNode.pos.y == endPos.y) {
        var curr = currentNode;
        var ret = [];
        while (curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        return { path: ret.reverse() };
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors
      openList.splice(lowInd, 1);
      closedList.push(currentNode);

      var neighbors = checkNeighbors(currentNode);

      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        if (
          closedList.find((node) => node.id == neighbor.id) ||
          neighbor.isWall
        ) {
          //|| neighbor.isWall()
          // not a valid node to process, skip to next neighbor
          continue;
        }

        // g score is the shortest distance from start to current node, we need to check if
        //   the path we have arrived at this neighbor is the shortest one we have seen yet
        var gScore = currentNode.g + currentNode.cost; // 1 is the distance from a node to it's neighbor
        var gScoreIsBest = false;

        if (!openList.find((node) => node.id == neighbor.id)) {
          // This the the first time we have arrived at this node, it must be the best
          // Also, we need to take the h (heuristic) score since we haven't done so yet

          gScoreIsBest = true;
          neighbor.h = heuristic(neighbor.pos, endPos);
          openList.push(neighbor);
        } else if (gScore < neighbor.g) {
          // We have already seen the node, but last time it had a worse g (distance from start)
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          // Found an optimal (so far) path to this node.   Store info on how we got here and
          neighbor.parent = currentNode;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }

    //found no path
    console.log("Error: cound't find the path");
    return { path: [] };
  }

  function heuristic(pos0, pos1) {
    // This is the Manhattan distance
    var d1 = Math.abs(pos1.x - pos0.x);
    var d2 = Math.abs(pos1.y - pos0.y);

    return d1 + d2;
  }

  function checkNeighbors(node) {
    var ret = [];
    var x = node.pos.x;
    var y = node.pos.y;

    if (grid[y - 1] && grid[y - 1][x]) {
      ret.push(grid[y - 1][x]);
    }
    if (grid[y + 1] && grid[y + 1][x]) {
      ret.push(grid[y + 1][x]);
    }
    if (grid[y][x - 1] && grid[y][x - 1]) {
      ret.push(grid[y][x - 1]);
    }
    if (grid[y][x + 1] && grid[y][x + 1]) {
      ret.push(grid[y][x + 1]);
    }
    return ret;
  }

  function getGrid() {
    return grid;
  }

  return { search, getCurrentMap: getGrid, init };
}

//each road connects two buildings or meets another road
export function drawRoads() {
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
