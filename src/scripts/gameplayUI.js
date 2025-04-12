// Renders 10 x 10 gameboard
const renderGameboard = (boardContainer, playerBoard) => {
  playerBoard.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const cell = document.createElement('div');

      cell.classList.add('cell');
      cell.dataset.row = rowIndex;
      cell.dataset.col = colIndex;

      boardContainer.appendChild(cell);
    });
  });
};

// Updates gameboard when an action is done
const updateGameboard = (row, col, state, ship) => {
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cell.classList.add(state, ship || '');
};

export { renderGameboard, updateGameboard };
