import "./styles.css";
import { drawRoads } from "./road-manager";
import { renderMap, loadTileSheet } from "./render-manager";
import { WORLD_INFO } from "./worldInfo";
import { drawGroupTiles } from "./group-manager";
import { resetcurrNodesMatrix } from "./tile-utils";
import { drawBuildings } from "./buildings-manager";
import { drawTrees } from "./trees-manager";

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

  renderMap();

  const duration = performance.now() - startTime;
  console.log(`Map loading took ${duration}ms`);
}
