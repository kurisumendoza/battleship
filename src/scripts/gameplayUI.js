// Renders 10 x 10 gameboard
const renderGameboard = (board) => {
  for (let i = 0; i < 100; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    board.appendChild(cell);
  }
};

export default renderGameboard;
