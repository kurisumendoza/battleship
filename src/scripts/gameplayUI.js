import activePlayer from './activePlayer';
import { createElement } from './helpers';

// Renders 10 x 10 gameboard
const renderGameboard = (boardContainer, playerBoard) => {
  playerBoard.board.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const cell = createElement('div', ['cell']);

      cell.dataset.row = rowIndex;
      cell.dataset.col = colIndex;

      boardContainer.appendChild(cell);

      if (col === 'miss') cell.classList.add('miss');

      if (col?.hasSunk) cell.classList.add('sunk', col.name);

      if (playerBoard.hit.has(`${rowIndex},${colIndex}`)) {
        cell.textContent = '💥';
        cell.classList.add('hit');
        if (playerBoard.board === activePlayer.gameboard.board)
          cell.style.fontSize = '0.75vw';
      }

      if (playerBoard.board === activePlayer.gameboard.board)
        if (col) cell.classList.add('hasShip', `${col.name}`);
    });
  });
};

// Updates gameboard when an action is done
const updateGameboard = (boardUI, row, col, state, ship = null) => {
  const cell = boardUI.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cell.classList.add(state);

  if (state === 'hit') cell.textContent = '💥';
  if (state === 'sunk') cell.classList.add(ship);
};

// Reveals sunk ship in the gameboard
const renderSunkShip = (boardUI, ship) => {
  ship.position.forEach((pos) => {
    const [row, col] = pos;
    updateGameboard(boardUI, row, col, 'sunk', ship.name);
  });
};

// Shows error message on UI
const renderErrorMsg = (container, message) => {
  if (container.firstChild) container.removeChild(container.firstChild);

  const errorMsg = createElement('p', ['error-msg']);
  errorMsg.textContent = message;

  container.appendChild(errorMsg);
};

export { renderGameboard, updateGameboard, renderSunkShip, renderErrorMsg };
