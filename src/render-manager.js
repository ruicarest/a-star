import { WORLD_INFO, TILEMAPPING } from "./worldInfo";

const TILES_WIDTH = WORLD_INFO.TILES_WIDTH;
const TILES_HEIGHT = WORLD_INFO.TILES_HEIGHT;

let buffer = document.getElementById("map-canvas").getContext("2d");
let context = document.getElementById("map-canvas").getContext("2d");

context.canvas.width = TILES_WIDTH * 16;
context.canvas.height = TILES_HEIGHT * 16;

const tileSheet = new Image();

export function loadTileSheet(url = "TileSheet.png") {
  return new Promise((resolve) => {
    tileSheet.addEventListener("load", () => {
      resolve(tileSheet);
    });

    //starts the loading process
    tileSheet.src = url;
  });
}

export function renderMap() {
  for (let i = 0; i < TILES_HEIGHT; i++) {
    for (let j = 0; j < TILES_WIDTH; j++) {
      let tileInfo = TILEMAPPING.find((element) => {
        return element.id == WORLD_INFO.WorldNodesMatrix[i][j].tileType;
      });

      if (!tileInfo) {
        console.log(
          "NO tile info: ",
          WORLD_INFO.WorldNodesMatrix[i][j].tileType
        );
      }

      let workdPosX = j * 16;
      let workdPosY = i * 16;

      if (tileInfo.backgroundID) {
        let backgroundTileInfo = TILEMAPPING.find((element) => {
          return element.id == tileInfo.backgroundID;
        });

        buffer.drawImage(
          tileSheet,
          backgroundTileInfo.column * 16,
          backgroundTileInfo.row * 16,
          16,
          16,
          workdPosX,
          workdPosY,
          16,
          16
        );
      }

      buffer.drawImage(
        tileSheet,
        tileInfo.column * 16,
        tileInfo.row * 16,
        16,
        16,
        workdPosX,
        workdPosY,
        16,
        16
      );
    }
  }

  context.drawImage(buffer.canvas, 0, 0);
}

export function resize() {
  context.canvas.width = TILES_WIDTH * 16;

  context.canvas.height = TILES_HEIGHT * 16;

  buffer.imageSmoothingEnabled = context.imageSmoothingEnabled = false;

  renderMap();
}

tileSheet.addEventListener("load", function () {
  console.log("resize on load image");
});
