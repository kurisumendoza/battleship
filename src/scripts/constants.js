const GAME_MODES = {
  VS_PLAYER: 'vsPlayer',
  VS_COMPUTER: 'vsComputer',
};

const NEXT_PLAYER = 'nextPlayer';

const COMPUTER_PLAYER = 'Computer';

const CELL_STATES = {
  HIT: 'hit',
  MISS: 'miss',
  SUNK: 'sunk',
  HAS_SHIP: 'has-ship',
};

const ORIENTATIONS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};

const SHIP_OFFSETS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

export {
  GAME_MODES,
  NEXT_PLAYER,
  COMPUTER_PLAYER,
  CELL_STATES,
  ORIENTATIONS,
  SHIP_OFFSETS,
};
