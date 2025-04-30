import activePlayer from './activePlayer';
import { gameStatusUI } from './selectors';

// Shows which player is currently active
const turnIndicator = (player) => {
  gameStatusUI.turnDisplay.textContent = `${player}'s Turn ...`;
};

// Displays status messages -- errors, hits, misses, etc.
const renderGameMessage = (type) => {
  const gameMessage = {
    miss: () => 'You missed!',
    hit: () => `${activePlayer.opponent?.name}'s ship got hit.`,
    sunk: () => `You sank ${activePlayer.opponent?.name}'s ship!`,
    error: () => 'Cell has already been targeted!',
    clear: () => '',
  };

  gameStatusUI.messageDisplay.textContent = gameMessage[type]();
};

// Initialize information shown on screen
const initializeGameStatusUI = (player) => {
  turnIndicator(player);
};

export { turnIndicator, renderGameMessage, initializeGameStatusUI };
