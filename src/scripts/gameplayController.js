import activePlayer from './activePlayer';
import { gameboardUI, controlsUI } from './selectors';
import renderLoadingScreen from './loadingScreen';
import { CELL_STATES, COMPUTER_PLAYER } from './constants';
import {
  togglePlayAgainBtn,
  renderGameboard,
  renderSunkShip,
  updateGameboard,
} from './gameplayUI';
import {
  displayWinner,
  initializeGameStatusUI,
  renderGameMessage,
  updateHP,
} from './gameStatusUI';

// Stores Gameboard state
const gameState = {
  hasAttacked: false,
  hasWinner: false,
};

// Creates a game summary to pass as parameter to displayWinner()
const createSummary = () => {
  const flatGameboard = activePlayer.oppGameboard.board.flat();

  const shipsSunk = Object.values(activePlayer.oppGameboard.ships).length;

  const turnsTaken = flatGameboard.filter((cell) => cell).length;

  const shipsLost = Object.values(activePlayer.gameboard.ships).filter(
    (ship) => ship.hasSunk,
  ).length;

  const misses = flatGameboard.filter(
    (cell) => cell === CELL_STATES.MISS,
  ).length;

  const accuracy = (((turnsTaken - misses) / turnsTaken) * 100).toFixed(2);

  return {
    shipsSunk,
    turnsTaken,
    shipsLost,
    misses,
    accuracy,
  };
};

// Declares winner and ends the game
const declareWinner = () => {
  if (!activePlayer.oppGameboard.isAllSunk()) return;

  gameState.hasWinner = true;
  displayWinner(createSummary());
  togglePlayAgainBtn();
};

// Evaluates attack result for updating the gameboard state
const evaluateAttackResult = (row, col) => {
  const attackResult =
    activePlayer.oppGameboard.board[row][col] !== CELL_STATES.MISS
      ? CELL_STATES.HIT
      : CELL_STATES.MISS;

  updateGameboard(gameboardUI.board, row, col, attackResult);

  if (attackResult === CELL_STATES.HIT) updateHP(activePlayer.opponent.name);

  if (activePlayer.oppGameboard.board[row][col].hasSunk) {
    renderSunkShip(
      gameboardUI.board,
      activePlayer.oppGameboard.board[row][col],
    );
    renderGameMessage(CELL_STATES.SUNK);
    declareWinner();
  } else renderGameMessage(attackResult);
};

// Calls receiveAttack on the opponent's board and updates the gameboard
const attack = (e) => {
  if (!e.target.closest('.cell')) return;

  if (
    e.target.classList.contains(CELL_STATES.HIT) ||
    e.target.classList.contains(CELL_STATES.MISS)
  ) {
    renderGameMessage('invalid');
    return;
  }

  const row = Number(e.target.dataset.row);
  const col = Number(e.target.dataset.col);

  activePlayer.oppGameboard.receiveAttack([row, col]);

  evaluateAttackResult(row, col);

  gameState.hasAttacked = true;

  gameboardUI.board.removeEventListener('click', attack);
};

// Handles the computer player's turn
const handleComputerTurn = () => {
  setTimeout(() => {
    const [row, col] = activePlayer.player.autoAttack(
      activePlayer.oppGameboard,
    );
    evaluateAttackResult(row, col);

    gameState.hasAttacked = true;
  }, 1000);
};

// Adds event listener to opponent's gameboard for attacking
const initializeActiveGameboard = () => {
  gameboardUI.board.addEventListener('click', attack);
};

// Removes the setup dialog and renders the actual gameboard
const startTurn = () => {
  gameboardUI.board.innerHTML = '';
  if (activePlayer.player.name !== COMPUTER_PLAYER)
    gameboardUI.yourBoard.innerHTML = '';

  renderGameboard(gameboardUI.board, activePlayer.oppGameboard);

  if (activePlayer.player.name !== COMPUTER_PLAYER) {
    initializeActiveGameboard();
    renderGameboard(gameboardUI.yourBoard, activePlayer.gameboard);
  } else {
    handleComputerTurn();
  }

  initializeGameStatusUI(activePlayer.player.name);
};

// Ends the turn and switches the board and activePlayer
const endTurn = () => {
  if (gameState.hasWinner) return;

  if (!gameState.hasAttacked) {
    renderGameMessage('blocked');
    return;
  }

  if (
    activePlayer.player.name !== COMPUTER_PLAYER &&
    activePlayer.opponent.name !== COMPUTER_PLAYER
  )
    renderLoadingScreen();

  activePlayer.switch();
  gameState.hasAttacked = false;
  renderGameMessage('clear');
  startTurn();
};

controlsUI.endTurn.addEventListener('click', endTurn);

export { startTurn, gameState };
