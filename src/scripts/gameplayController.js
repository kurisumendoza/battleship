import { renderGameboard, updateGameboard } from './gameplayUI';
import activePlayer from './activePlayer';
import { gameboardUI } from './selectors';

// Calls receiveAttack on the opponent's board
const attack = (opponent, boardUI, e) => {
  if (!e.target.closest('.cell')) return;

  const row = Number(e.target.dataset.row);
  const col = Number(e.target.dataset.col);

  opponent.receiveAttack([row, col]);

  const attackResult = opponent.board[row][col] !== 'miss' ? 'hit' : 'miss';
  updateGameboard(boardUI, row, col, attackResult);
};

// Adds event listener to opponent's gameboard for attacking
// opponent param accepts opponent's Gameboard instance instead of Player
const initializeActiveGameboard = (opponent, boardUI) => {
  boardUI.addEventListener('click', (e) => attack(opponent, boardUI, e), {
    once: true,
  });
};

// Removes the setup dialog and renders the actual gameboard
const launchGame = () => {
  renderGameboard(gameboardUI.yourBoard, activePlayer.gameboard.board);
  renderGameboard(gameboardUI.board, activePlayer.oppGameboard.board);

  initializeActiveGameboard(activePlayer.oppGameboard, gameboardUI.board);
};

export default launchGame;
