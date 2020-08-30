export const WORLD_INFO = {
  TILES_WIDTH: 40,
  TILES_HEIGHT: 40,
  BUILDINGS_NUMBER: 20,
  TREES_NUMBER: 0,
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

export const TILEMAPPING = [
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
];

export const THEME_TILEMAPPING = [
  {
    themeID: 0,
    themeName: "Default",
  },
  {
    themeID: 1,
    themeName: "Spring",
    terrainTiles: [
      {
        id: 5,
        name: "grass",
        column: 10,
        row: 2,
      },
    ],
    roadTiles: [
      {
        id: 0,
        name: "road_vertical",
        column: 8,
        row: 6,
      },
      {
        id: 1,
        name: "road_corner_left_top",
        column: 6,
        row: 6,
      },
      {
        id: 3,
        name: "road_corner_right_top",
        column: 7,
        row: 6,
      },
      {
        id: 5,
        name: "road_crossroads",
        column: 11,
        row: 6,
      },
      {
        id: 7,
        name: "road_corner_left_bottom",
        column: 6,
        row: 7,
      },
      {
        id: 9,
        name: "road_corner_right_bottom",
        column: 7,
        row: 7,
      },
      {
        id: 10,
        name: "road_horizontal",
        column: 9,
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
