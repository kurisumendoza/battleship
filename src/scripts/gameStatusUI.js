import { gameStatusUI } from './selectors';

// Shows which player is currently active
const turnIndicator = (player) => {
  gameStatusUI.turnDisplay.textContent = `${player}'s Turn ...`;
};

// Initialize information shown on screen
const initializeGameStatusUI = (player) => {
  turnIndicator(player);
};

export { turnIndicator, initializeGameStatusUI };
