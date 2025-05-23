import activePlayer from './activePlayer';
import { CELL_STATES, COMPUTER_PLAYER } from './constants';
import createElement from './helpers';
import { controlsUI } from './selectors';

// Renders 10 x 10 gameboard
const renderGameboard = (boardContainer, playerBoard) => {
  if (activePlayer.player.name === COMPUTER_PLAYER)
    boardContainer.classList.add('disable-gameboard');
  else boardContainer.classList.remove('disable-gameboard');

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
      }

      if (playerBoard.board === activePlayer.gameboard.board)
        if (col && col !== CELL_STATES.MISS)
          cell.classList.add(CELL_STATES.HAS_SHIP, `${col.name}`);
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

// Changes the text of the End Turn btn when it is the Computer's turn
const toggleEndTurnBtnText = () => {
  if (
    activePlayer.player.name !== COMPUTER_PLAYER &&
    activePlayer.opponent.name !== COMPUTER_PLAYER
  )
    return;

  controlsUI.endTurn.textContent =
    controlsUI.endTurn.textContent === 'End Turn'
      ? 'End Computer Turn'
      : 'End Turn';
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
  toggleEndTurnBtnText,
  togglePlayAgainBtn,
};
