import './styles/main.css';
import renderGameboard from './scripts/ui';
import { startScreen, gameboardUI } from './scripts/selectors';

const initializeGame = () => {
  if (startScreen) startScreen.showModal();
  renderGameboard(gameboardUI.board);
  renderGameboard(gameboardUI.enemyBoard);
};

window.addEventListener('DOMContentLoaded', () => {
  initializeGame();
});
