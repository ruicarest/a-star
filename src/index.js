import "./styles.css";
import { drawRoads } from "./road-manager";
import { renderMap, loadTileSheet } from "./render-manager";
import { WORLD_INFO } from "./worldInfo";
import { drawGroupTiles } from "./group-manager";
import { resetcurrNodesMatrix, writeTileNumbersOnCanvas } from "./tile-utils";
import { drawBuildings } from "./buildings-manager";
import { drawTrees } from "./trees-manager";

import { snoise2 } from "./algorithms/simplex-noise";

/* IDEA: having maps of 16x16 seems a good size, with screen loading */

const TILETYPES = WORLD_INFO.TILETYPES;

resetcurrNodesMatrix();

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

loadTileSheet().then((tilesheet) => {
  if (tilesheet) {
    loadNewMap();
  } else {
    console.log("no tilesheet found: ", tileSheet);
  }
});

function loadNewMap() {
  const startTime = performance.now();

  resetcurrNodesMatrix();

  for (let i = 0; i < WORLD_INFO.TILES_HEIGHT; i++) {
    for (let j = 0; j < WORLD_INFO.TILES_WIDTH; j++) {
      WORLD_INFO.WorldNodesMatrix[i][j].tileType =
        snoise2(j * 0.1123, i * 0.1123) < 0 ? 4 : 5;
    }
  }

  renderMap();
  //writeTileNumbersOnCanvas();

  // drawGroupTiles(TILETYPES.water, Math.floor(Math.random() * 100 + 20));
  // drawGroupTiles(TILETYPES.water, Math.floor(Math.random() * 100 + 20));
  // drawGroupTiles(TILETYPES.water, Math.floor(Math.random() * 100 + 20));
  // drawGroupTiles(TILETYPES.water, Math.floor(Math.random() * 100 + 20));
  // drawGroupTiles(TILETYPES.water, Math.floor(Math.random() * 100 + 20));

  // drawTrees();

  // drawGroupTiles(TILETYPES.grass, Math.floor(Math.random() * 20 + 20));
  // drawGroupTiles(TILETYPES.grass, Math.floor(Math.random() * 20 + 20));
  // drawGroupTiles(TILETYPES.grass, Math.floor(Math.random() * 20 + 20));

  // drawBuildings();

  // drawRoads();

  // renderMap();

  const duration = performance.now() - startTime;
  console.log(`Map loading took ${duration}ms`);
}
