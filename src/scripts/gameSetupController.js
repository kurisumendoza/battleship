import { startScreen, gameboardUI } from './selectors';
import renderGameboard from './gameplayUI';
import { renderGameModeOptions } from './gameSetupUI';

const initializeGame = () => {
  if (startScreen.dialog) startScreen.dialog.showModal();
  renderGameboard(gameboardUI.board);
  renderGameboard(gameboardUI.enemyBoard);
};

startScreen.startBtn.addEventListener('click', renderGameModeOptions);

export default initializeGame;
