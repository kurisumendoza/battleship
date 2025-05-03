import activePlayer from './activePlayer';
import { CELL_STATES } from './constants';
import { createElement } from './helpers';
import { controlsUI } from './selectors';

// Renders 10 x 10 gameboard
const renderGameboard = (boardContainer, playerBoard) => {
  playerBoard.board.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const cell = createElement('div', ['cell']);

      cell.dataset.row = rowIndex;
      cell.dataset.col = colIndex;

      boardContainer.appendChild(cell);

      if (col === CELL_STATES.MISS) cell.classList.add(CELL_STATES.MISS);

      if (col?.hasSunk)
        cell.classList.add(CELL_STATES.SUNK, CELL_STATES.HAS_SHIP, col.name);

      if (playerBoard.hit.has(`${rowIndex},${colIndex}`)) {
        cell.textContent = '💥';
        cell.classList.add(CELL_STATES.HIT);
        if (playerBoard.board === activePlayer.gameboard.board)
          cell.style.fontSize = '0.75vw';
      }

      if (playerBoard.board === activePlayer.gameboard.board)
        if (col) cell.classList.add(CELL_STATES.HAS_SHIP, `${col.name}`);
    });
  });
};

// Updates gameboard when an action is done
const updateGameboard = (boardUI, row, col, state, ship = null) => {
  const cell = boardUI.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cell.classList.add(state);

  if (state === CELL_STATES.HIT) cell.textContent = '💥';
  if (state === CELL_STATES.SUNK)
    cell.classList.add(CELL_STATES.HAS_SHIP, ship);
};

// Reveals sunk ship in the gameboard
const renderSunkShip = (boardUI, ship) => {
  ship.position.forEach((pos) => {
    const [row, col] = pos;
    updateGameboard(boardUI, row, col, CELL_STATES.SUNK, ship.name);
  });
};

// Shows error message on UI
const renderErrorMsg = (container, message) => {
  if (container.firstChild) container.removeChild(container.firstChild);

  const errorMsg = createElement('p', ['error-msg']);
  errorMsg.textContent = message;

  container.appendChild(errorMsg);
};

// Toggles 'Play Again' button for resetting the game
const togglePlayAgainBtn = () => {
  controlsUI.playAgainContainer.style.visibility =
    controlsUI.playAgainContainer.style.visibility === 'visible'
      ? 'hidden'
      : 'visible';
};

export {
  renderGameboard,
  updateGameboard,
  renderSunkShip,
  renderErrorMsg,
  togglePlayAgainBtn,
};
