export const WORLD_INFO = {
  TILES_WIDTH: 40,
  TILES_HEIGHT: 40,
  BUILDINGS_NUMBER: 20,
  TREES_NUMBER: 10,
  TILETYPES: {
    untouched: 10,
    road: 1,
    building: 2,
    tree: 3,
    water: 4,
    grass: 5,
  },
  WorldNodesMatrix: null,
};

export const THEME_TILEMAPPING = [
  {
    themeID: 0,
    themeName: "Default",
    miscelaneous: [
      {
        id: 10,
        name: "untouched",
        column: 7,
        row: 1,
      },
      {
        id: 1,
        name: "road",
        column: 4,
        row: 1,
      },
      {
        id: 2,
        name: "building",
        column: 1,
        row: 35,
        backgroundID: WORLD_INFO.TILETYPES.untouched,
      },
      {
        id: 3,
        name: "tree",
        column: 1,
        row: 37,
        backgroundID: WORLD_INFO.TILETYPES.untouched,
      },
      {
        id: 4,
        name: "waterMiddle",
        column: 4,
        row: 22,
      },
      {
        id: 5,
        name: "grass",
        column: 10,
        row: 2,
      },
    ],
  },
  {
    themeID: 1,
    themeName: "Spring",
    miscelaneous: [
      {
        id: 1,
        name: "road",
        column: 4,
        row: 1,
      },
      {
        id: 2,
        name: "building",
        column: 1,
        row: 35,
        backgroundID: 10, //terraintile
      },
      {
        id: 3,
        name: "tree",
        column: 1,
        row: 37,
        backgroundID: 10, //terraintile
      },
      {
        id: 4,
        name: "waterMiddle",
        column: 6,
        row: 12,
      },
      {
        id: 5,
        name: "herb",
        column: 10,
        row: 2,
      },
    ],
    terrainTiles: [
      {
        id: 10,
        name: "grass",
        column: 7,
        row: 1,
      },
    ],
    roadTiles: [
      {
        id: 0,
        name: "top_bottom",
        column: 8,
        row: 6,
      },
      {
        id: 1,
        name: "bottom_right",
        column: 6,
        row: 6,
      },
      {
        id: 3,
        name: "bottom_left",
        column: 7,
        row: 6,
      },
      {
        id: 5,
        name: "road_crossroads",
        column: 8,
        row: 7,
      },
      {
        id: 7,
        name: "top_right",
        column: 6,
        row: 7,
      },
      {
        id: 9,
        name: "top_left",
        column: 7,
        row: 7,
      },
      {
        id: 10,
        name: "left_right",
        column: 9,
        row: 7,
      },
      {
        id: 2,
        name: "top_bottom_right",
        column: 8,
        row: 8,
      },
      {
        id: 4,
        name: "top_left_right",
        column: 10,
        row: 8,
      },
      {
        id: 6,
        name: "bottom_left_right",
        column: 10,
        row: 6,
      },
      {
        id: 8,
        name: "top_bottom_left",
        column: 10,
        row: 7,
      },
    ],
  },
  {
    themeID: 2,
    themeName: "Winter",
    miscelaneous: [
      {
        id: 1,
        name: "road",
        column: 4,
        row: 1,
      },
      {
        id: 2,
        name: "building",
        column: 1,
        row: 35,
        backgroundID: 10, //terraintile
      },
      {
        id: 3,
        name: "tree",
        column: 2,
        row: 37,
        backgroundID: 10, //terraintile
      },
      {
        id: 4,
        name: "waterMiddle",
        column: 4,
        row: 22,
      },
      {
        id: 5,
        name: "winter_herb",
        column: 9,
        row: 0,
      },
    ],
    terrainTiles: [
      {
        id: 10,
        name: "snow",
        column: 4,
        row: 4,
      },
    ],
    roadTiles: [
      {
        id: 0,
        name: "top_bottom",
        column: 2,
        row: 6,
      },
      {
        id: 1,
        name: "bottom_right",
        column: 0,
        row: 6,
      },
      {
        id: 3,
        name: "bottom_left",
        column: 1,
        row: 6,
      },
      {
        id: 5,
        name: "road_crossroads",
        column: 2,
        row: 7,
      },
      {
        id: 7,
        name: "top_right",
        column: 0,
        row: 7,
      },
      {
        id: 9,
        name: "top_left",
        column: 1,
        row: 7,
      },
      {
        id: 10,
        name: "left_right",
        column: 3,
        row: 7,
      },
      {
        id: 2,
        name: "top_bottom_right",
        column: 2,
        row: 8,
      },
      {
        id: 4,
        name: "top_left_right",
        column: 4,
        row: 8,
      },
      {
        id: 6,
        name: "bottom_left_right",
        column: 4,
        row: 6,
      },
      {
        id: 8,
        name: "top_bottom_left",
        column: 4,
        row: 7,
      },
    ],
  },
  {},
];

const TILEMAPIMAGE = {
  height: 688,
  width: 192,
  columns: 12,
  row: 43,
  tile_width: 16,
  tile_height: 16,
};
