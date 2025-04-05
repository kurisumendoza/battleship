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

export default renderGameboard;
