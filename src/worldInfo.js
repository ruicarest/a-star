export const WORLD_INFO = {
  TILES_WIDTH: 60,
  TILES_HEIGHT: 50,
  BUILDINGS_NUMBER: 20,
  TREES_NUMBER: 100,
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
    size: { width: 16, height: 16 },
  },
  {
    id: 1,
    name: "road",
    column: 4,
    row: 1,
    size: { width: 16, height: 16 },
  },
  {
    id: 2,
    name: "building",
    column: 1,
    row: 35,
    size: { width: 16, height: 16 },
    backgroundID: WORLD_INFO.TILETYPES.untouched,
  },
  {
    id: 3,
    name: "tree",
    column: 1,
    row: 37,
    size: { width: 16, height: 16 },
    backgroundID: WORLD_INFO.TILETYPES.untouched,
  },
  {
    id: 4,
    name: "waterMiddle",
    column: 4,
    row: 22,
    size: { width: 16, height: 16 },
  },
  {
    id: 5,
    name: "grass",
    column: 10,
    row: 2,
    size: { width: 16, height: 16 },
  },
];

const TILEMAPIMAGE = {
  height: 688,
  width: 192,
  columns: 12,
  row: 43,
  tile_width: 16,
  tile_height: 16,
};
