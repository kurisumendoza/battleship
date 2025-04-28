import { renderGameboard, renderSunkShip, updateGameboard } from './gameplayUI';
import activePlayer from './activePlayer';
import { gameboardUI, controlsUI } from './selectors';
import { initializeGameStatusUI } from './gameStatusUI';

// Stores Gameboard state
let hasAttacked = false;

// Calls receiveAttack on the opponent's board
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

  if (activePlayer.oppGameboard.board[row][col].hasSunk)
    renderSunkShip(
      gameboardUI.board,
      activePlayer.oppGameboard.board[row][col],
    );

  hasAttacked = true;

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
  if (!hasAttacked) return;

  activePlayer.switch();
  hasAttacked = false;
  launchGame();
};

controlsUI.endTurn.addEventListener('click', endTurn);

export default launchGame;
