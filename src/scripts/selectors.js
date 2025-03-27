const startScreen = document.querySelector('.start-screen');

const gameSetup = document.querySelector('.game-setup');

const header = document.querySelector('.header');

const gameboardUI = {
  board: document.querySelector('.gameboard'),
  enemyBoard: document.querySelector('.enemy-board'),
};

const playerStatsUI = {
  p1Stats: document.querySelector('.player1-stats'),
  p2Stats: document.querySelector('.player2-stats'),
};

const controlsUI = {
  startGame: document.querySelector('.start-game'),
  endTurn: document.querySelector('.end-turn-btn button'),
  playAgain: document.querySelector('.play-again-btn button'),
};

const gameSummary = {
  winner: document.querySelector('.winner-display h3'),
  winningPlayer: document.querySelector('.winner'),
  summary: document.querySelector('.game-summary'),
  enemySunk: document.querySelector('.enemy-sunk'),
  turnsTaken: document.querySelector('.turns-taken'),
  ownSunk: document.querySelector('.own-sunk'),
  accuracy: document.querySelector('.accuracy'),
  misses: document.querySelector('.misses'),
  hitStreak: document.querySelector('.hit-streak'),
};

export {
  startScreen,
  gameSetup,
  header,
  gameboardUI,
  controlsUI,
  playerStatsUI,
  gameSummary,
};
