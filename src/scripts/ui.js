import { gameboardUI } from './selectors';

const renderGameboard = () => {
  for (let i = 0; i < 100; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gameboardUI.board.appendChild(cell);
  }
};

export default renderGameboard;
