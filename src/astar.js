import _ from "lodash";

export const astar = {
  init: function (grid) {
    for (var yPos = 0; yPos < grid.length; yPos++) {
      for (var xPos = 0; xPos < grid[yPos].length; xPos++) {
        grid[yPos][xPos].f = 1000;
        grid[yPos][xPos].g = 0;
        grid[yPos][xPos].h = 0;
        grid[yPos][xPos].pos = {
          x: xPos,
          y: yPos,
        };
        grid[yPos][xPos].debug = "";
        grid[yPos][xPos].tileStyle = 0;
        grid[yPos][xPos].parent = null;
        grid[yPos][xPos].id = _.uniqueId("node");
      }
    }

    //console.log(grid);
  },
  search: function (grid, start, end) {
    astar.init(grid);

    var openList = [];
    var closedList = [];
    openList.push(grid[start.pos.y][start.pos.x]);

    while (openList.length > 0) {
      // Grab the lowest f(x) to process next
      var lowInd = 0;
      for (var i = 0; i < openList.length; i++) {
        if (openList[i].f < openList[lowInd].f) {
          lowInd = i;
        }
      }
      var currentNode = openList[lowInd];
      //console.log(openList[lowInd]);

      // End case -- result has been found, return the traced path
      if (currentNode.pos.x == end.pos.x && currentNode.pos.y == end.pos.y) {
        var curr = currentNode;
        var ret = [];
        while (curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        return { path: ret.reverse(), map: grid };
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors
      openList.splice(lowInd, 1);
      closedList.push(currentNode);

      var neighbors = astar.neighbors(grid, currentNode);

      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        if (closedList.find((node) => node.id == neighbor.id)) {
          //|| neighbor.isWall()
          // not a valid node to process, skip to next neighbor
          continue;
        }

        // g score is the shortest distance from start to current node, we need to check if
        //   the path we have arrived at this neighbor is the shortest one we have seen yet
        var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
        //console.log(gScore); NaN
        var gScoreIsBest = false;

        if (!openList.find((node) => node.id == neighbor.id)) {
          // This the the first time we have arrived at this node, it must be the best
          // Also, we need to take the h (heuristic) score since we haven't done so yet

          gScoreIsBest = true;
          neighbor.h = astar.heuristic(neighbor.pos, end.pos);
          openList.push(neighbor);
        } else if (gScore < neighbor.g) {
          // We have already seen the node, but last time it had a worse g (distance from start)
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          // Found an optimal (so far) path to this node.   Store info on how we got here and
          //  just how good it really is...
          neighbor.parent = currentNode;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.debug =
            "F: " +
            neighbor.f +
            "<br />G: " +
            neighbor.g +
            "<br />H: " +
            neighbor.h;
          //console.log(neighbor.debug);
        }
      }
    }

    // No result was found -- empty array signifies failure to find path
    //console.log("found no results");
    return { path: [], map: grid };
  },
  heuristic: function (pos0, pos1) {
    // This is the Manhattan distance
    var d1 = Math.abs(pos1.x - pos0.x);
    var d2 = Math.abs(pos1.y - pos0.y);

    return d1 + d2;
  },
  neighbors: function (grid, node) {
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
  },
};
