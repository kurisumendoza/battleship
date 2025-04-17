import { renderGameboard } from './gameplayUI';
import activePlayer from './activePlayer';
import { gameboardUI } from './selectors';

const launchGame = () => {
  renderGameboard(gameboardUI.yourBoard, activePlayer.gameboard.board);
  renderGameboard(gameboardUI.board, activePlayer.oppGameboard.board);
};

export default launchGame;
