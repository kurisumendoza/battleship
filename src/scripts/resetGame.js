import activePlayer from './activePlayer';
import { resetPlayers } from './createPlayers';
import { gameState } from './gameplayController';
import { togglePlayAgainBtn } from './gameplayUI';
import initializeGame from './gameSetupController';
import { rerenderStartScreen } from './gameSetupUI';
import { resetGameStatusUI } from './gameStatusUI';
import { controlsUI, gameboardUI, playerStatsUI } from './selectors';

const resetRemainingShipsUI = () => {
  const shipEl = document.querySelectorAll('.remaining-ships-container div');

  shipEl.forEach((ship) => {
    const shipDiv = ship;

    shipDiv.textContent = '';
    shipDiv.style.filter = '';
  });
};

const resetGame = () => {
  gameState.hasAttacked = false;
  gameState.hasWinner = false;
  resetPlayers();
  activePlayer.reset();

  playerStatsUI.p1Health.style.width = '100%';
  playerStatsUI.p2Health.style.width = '100%';
  playerStatsUI.p1Health.style.backgroundColor = '';
  playerStatsUI.p2Health.style.backgroundColor = '';
  resetRemainingShipsUI();

  gameboardUI.yourBoard.innerHTML = '';
  gameboardUI.board.innerHTML = '';
  togglePlayAgainBtn();

  resetGameStatusUI();
  rerenderStartScreen();

  initializeGame();
};

controlsUI.playAgain.addEventListener('click', resetGame);

export default resetGame;
