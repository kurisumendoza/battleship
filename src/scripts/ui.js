const renderGameboard = (gameboard) => {
  for (let i = 0; i < 100; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gameboard.appendChild(cell);
  }
};

export default renderGameboard;
