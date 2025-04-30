import { renderGameboard, renderSunkShip, updateGameboard } from './gameplayUI';
import activePlayer from './activePlayer';
import { gameboardUI, controlsUI } from './selectors';
import {
  displayWinner,
  initializeGameStatusUI,
  renderGameMessage,
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

  const misses = flatGameboard.filter((cell) => cell === 'miss').length;

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
};

// Calls receiveAttack on the opponent's board and updates the gameboard
const attack = (e) => {
  if (!e.target.closest('.cell')) return;

  if (e.target.classList.contains('hit') || e.target.classList.contains('miss'))
    return;

  const row = Number(e.target.dataset.row);
  const col = Number(e.target.dataset.col);

  activePlayer.oppGameboard.receiveAttack([row, col]);

  const attackResult =
    activePlayer.oppGameboard.board[row][col] !== 'miss' ? 'hit' : 'miss';

  updateGameboard(gameboardUI.board, row, col, attackResult);

  if (activePlayer.oppGameboard.board[row][col].hasSunk) {
    renderSunkShip(
      gameboardUI.board,
      activePlayer.oppGameboard.board[row][col],
    );
    renderGameMessage('sunk');
    declareWinner();
  } else renderGameMessage(attackResult);

  gameState.hasAttacked = true;

  gameboardUI.board.removeEventListener('click', attack);
};

// Adds event listener to opponent's gameboard for attacking
const initializeActiveGameboard = () => {
  gameboardUI.board.addEventListener('click', attack);
};

// Removes the setup dialog and renders the actual gameboard
const launchGame = () => {
  gameboardUI.yourBoard.innerHTML = '';
  gameboardUI.board.innerHTML = '';

  renderGameboard(gameboardUI.yourBoard, activePlayer.gameboard);
  renderGameboard(gameboardUI.board, activePlayer.oppGameboard);

  initializeActiveGameboard();
  initializeGameStatusUI(activePlayer.player.name);
};

// Ends the turn and switches the board and activePlayer
const endTurn = () => {
  if (!gameState.hasAttacked || gameState.hasWinner) return;

  activePlayer.switch();
  gameState.hasAttacked = false;
  renderGameMessage('clear');
  launchGame();
};

controlsUI.endTurn.addEventListener('click', endTurn);

export default launchGame;
