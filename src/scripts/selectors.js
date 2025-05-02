const header = document.querySelector('.header');

const startScreen = {
  dialog: document.querySelector('.start-screen'),
  title: document.querySelector('.start-screen h1'),
  startBtn: document.querySelector('.start-new-game'),
  setupContainer: document.querySelector('.game-setup-container'),
};

const loadingScreen = {
  dialog: document.querySelector('.loading-screen'),
  message: document.querySelector('.loading-screen p'),
  loader: document.querySelector('.loader'),
  readyBtn: document.querySelector('.loading-screen button'),
};

const gameboardUI = {
  board: document.querySelector('.gameboard'),
  yourBoard: document.querySelector('.your-board'),
};

const playerStatsUI = {
  p1Stats: document.querySelector('.player1-stats'),
  p2Stats: document.querySelector('.player2-stats'),
};

const gameStatusUI = {
  turnDisplay: document.querySelector('.turn-display h3'),
  messageDisplay: document.querySelector('.game-message-display'),
};

const controlsUI = {
  endTurn: document.querySelector('.end-turn-btn button'),
  playAgainContainer: document.querySelector('.play-again-btn'),
  playAgain: document.querySelector('.play-again-btn button'),
};

const gameSummary = {
  container: document.querySelector('.winner-display'),
  winner: document.querySelector('.winner-display h3'),
  summary: document.querySelector('.game-summary'),
};

export {
  header,
  startScreen,
  loadingScreen,
  gameboardUI,
  playerStatsUI,
  gameStatusUI,
  controlsUI,
  gameSummary,
};
