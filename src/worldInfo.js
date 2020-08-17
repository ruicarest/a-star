export const WORLD_INFO = {
  TILES_WIDTH: 30,
  TILES_HEIGHT: 20,
  BUILDINGS_NUMBER: 6,
  TREES_NUMBER: 30,
  TILETYPES: {
    untouched: 10,
    road: 1,
    building: 2,
    tree: 3,
    water: 4,
    grass: 5,
  },
  WorldNodesArray: null,
};

export const TILEMAPPING = [
  {
    id: 10,
    name: "grass",
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
];

const TILEMAPIMAGE = {
  height: 688,
  width: 192,
  columns: 12,
  row: 43,
  tile_width: 16,
  tile_height: 16,
};
