import { createElement } from './helpers';

// Renders 10 x 10 gameboard
const renderGameboard = (boardContainer, playerBoard) => {
  playerBoard.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const cell = createElement('div', ['cell']);

      cell.dataset.row = rowIndex;
      cell.dataset.col = colIndex;

      boardContainer.appendChild(cell);
    });
  });
};

// Updates gameboard when an action is done
const updateGameboard = (row, col, state) => {
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cell.classList.add(state);
};

// Shows error message on UI
const renderErrorMsg = (container, message) => {
  if (container.firstChild) container.removeChild(container.firstChild);

  const errorMsg = createElement('p', ['error-msg']);
  errorMsg.textContent = message;

  container.appendChild(errorMsg);
};

export { renderGameboard, updateGameboard, renderErrorMsg };
