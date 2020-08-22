import "./styles.css";
import { drawRoads } from "./road-manager";
import { resize } from "./render-manager";
import { WORLD_INFO } from "./worldInfo";
import { drawGroupTiles } from "./group-manager";
import { getRandomNode, resetcurrNodesMatrix } from "./tile-utils";
import { drawBuildings } from "./buildings-manager";

const TREES_NUMBER = WORLD_INFO.TREES_NUMBER;
const TILETYPES = WORLD_INFO.TILETYPES;

resetcurrNodesMatrix();

function drawTrees(treesNumber = TREES_NUMBER) {
  for (let i = 0; i < treesNumber; i++) {
    let newTree = getRandomNode(WORLD_INFO.WorldNodesMatrix);

    while (newTree.tileType != TILETYPES.untouched) {
      newTree = getRandomNode(WORLD_INFO.WorldNodesMatrix);
    }

    newTree.tileType = TILETYPES.tree;
  }
}

let isAutoGenerating = false;
let setIntervalID = null;

const autoFeatureBtn = document.getElementById("stop");
const loadNewMapBtn = document.getElementById("loadNewMap");

autoFeatureBtn.style.backgroundColor = "lightgreen";

loadNewMapBtn.onclick = loadNewMap;

autoFeatureBtn.onclick = () => {
  if (isAutoGenerating) {
    isAutoGenerating = false;
    clearInterval(setIntervalID);
    autoFeatureBtn.innerText = "Start Auto";
    autoFeatureBtn.style.backgroundColor = "lightgreen";
  } else {
    isAutoGenerating = true;
    setIntervalID = setInterval(function () {
      loadNewMap();
    }, 2000);

    autoFeatureBtn.innerText = "Stop Auto";
    autoFeatureBtn.style.backgroundColor = "#eb8888"; //lightred
  }
};

loadNewMap();

function loadNewMap() {
  const startTime = performance.now();

  console.log("new search...");
  resetcurrNodesMatrix();

  drawBuildings();

  //drawGroupTiles(TILETYPES.water, 2);
  drawGroupTiles(TILETYPES.water, 10);
  drawGroupTiles(TILETYPES.water, 20);
  // drawGroupTiles(TILETYPES.water, 20);
  // drawGroupTiles(TILETYPES.water, 10);
  // drawGroupTiles(TILETYPES.water, 20);

  // drawGroupTiles(TILETYPES.grass, 6);
  // drawGroupTiles(TILETYPES.grass, 8);
  // drawGroupTiles(TILETYPES.grass, 6);
  // drawGroupTiles(TILETYPES.grass, 8);
  // drawGroupTiles(TILETYPES.grass, 6);
  // drawGroupTiles(TILETYPES.grass, 18);

  // drawGroupTiles(TILETYPES.grass, 6);
  drawGroupTiles(TILETYPES.grass, 8);
  // drawGroupTiles(TILETYPES.grass, 6);
  // drawGroupTiles(TILETYPES.grass, 8);
  // drawGroupTiles(TILETYPES.grass, 6);
  // drawGroupTiles(TILETYPES.grass, 180);

  drawTrees();

  drawRoads();

  //writeOnCanvas();

  resize();

  const duration = performance.now() - startTime;
  console.log(`someMethodIThinkMightBeSlow took ${duration}ms`);
}
