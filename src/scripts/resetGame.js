import activePlayer from './activePlayer';
import { resetPlayers } from './createPlayers';
import { gameState } from './gameplayController';
import { togglePlayAgainBtn } from './gameplayUI';
import initializeGame from './gameSetupController';
import { rerenderStartScreen } from './gameSetupUI';
import { resetGameStatusUI } from './gameStatusUI';
import { controlsUI, gameboardUI } from './selectors';

const resetGame = () => {
  gameState.hasAttacked = false;
  gameState.hasWinner = false;
  resetPlayers();
  activePlayer.reset();

  gameboardUI.yourBoard.innerHTML = '';
  gameboardUI.board.innerHTML = '';
  togglePlayAgainBtn();

  resetGameStatusUI();
  rerenderStartScreen();

  initializeGame();
};

controlsUI.playAgain.addEventListener('click', resetGame);

export default resetGame;
