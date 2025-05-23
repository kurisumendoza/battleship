const header = document.querySelector('.header');

const startScreen = {
  dialog: document.querySelector('.start-screen'),
  title: document.querySelector('.start-screen-content h1'),
  startBtn: document.querySelector('.start-new-game'),
  setupContainer: document.querySelector('.game-setup-container'),
};

const loadingScreen = {
  dialog: document.querySelector('.loading-screen'),
  message: document.querySelector('.loading-screen-content p'),
  loader: document.querySelector('.loader'),
  readyBtn: document.querySelector('.loading-screen-content button'),
};

const gameboardUI = {
  board: document.querySelector('.gameboard'),
  yourBoard: document.querySelector('.your-board'),
};

const playerStatsUI = {
  p1Stats: document.querySelector('.player1-stats'),
  p1Name: document.querySelector('.player1 span'),
  p1Health: document.querySelector('.player1 .actual-hp'),
  p1Ships: document.querySelector('.player1 .ships-remaining'),
  p2Stats: document.querySelector('.player2-stats'),
  p2Name: document.querySelector('.player2 span'),
  p2Health: document.querySelector('.player2 .actual-hp'),
  p2Ships: document.querySelector('.player2 .ships-remaining'),
};

const gameStatusUI = {
  turnDisplay: document.querySelector('.turn-display span'),
  messageDisplay: document.querySelector('.game-message-display'),
};

const controlsUI = {
  endTurn: document.querySelector('.end-turn-btn button'),
  playAgainContainer: document.querySelector('.play-again-btn'),
  playAgain: document.querySelector('.play-again-btn button'),
};

const gameSummary = {
  container: document.querySelector('.winner-display'),
  winner: document.querySelector('.winner-display p:first-of-type'),
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
