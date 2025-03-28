import './styles/main.css';
import { renderGameboard, renderGameModeOptions } from './scripts/ui';
import { startScreen, gameboardUI } from './scripts/selectors';

const initializeGame = () => {
  if (startScreen.dialog) startScreen.dialog.showModal();
  renderGameboard(gameboardUI.board);
  renderGameboard(gameboardUI.enemyBoard);
};

window.addEventListener('DOMContentLoaded', initializeGame);
startScreen.startBtn.addEventListener('click', renderGameModeOptions);
