import activePlayer from './activePlayer';
import { gameStatusUI, gameSummary } from './selectors';

// Shows which player is currently active
const turnIndicator = (player) => {
  gameStatusUI.turnDisplay.textContent = `${player}'s Turn ...`;
};

// Displays status messages -- errors, hits, misses, etc.
const renderGameMessage = (type) => {
  const gameMessage = {
    miss: () => 'You missed!',
    hit: () => `${activePlayer.opponent?.name}'s ship got hit.`,
    sunk: () => `${activePlayer.opponent?.name}'s ship has been sunk!`,
    invalid: () => 'Cell has already been targeted!',
    blocked: () => "You haven't made a move yet",
    clear: () => '',
  };

  gameStatusUI.messageDisplay.textContent = gameMessage[type]();
};

// Initialize information shown on screen
const initializeGameStatusUI = (player) => {
  turnIndicator(player);
};

// Displays the winner and some gameplay stats
const displayWinner = (summary) => {
  const { shipsSunk, turnsTaken, shipsLost, misses, accuracy } = summary;

  gameSummary.container.style.visibility = 'visible';

  gameSummary.winner.textContent = `${activePlayer.player.name} Wins!`;

  gameSummary.summary.innerHTML = ` 
    <ul>
      <li>Enemy Ships Sunk: <span>${shipsSunk}</span></li>
      <li>Ships Lost: <span>${shipsLost}</span></li>
      <li>Total Turns Taken: <span>${turnsTaken}</span></li>
      <li>Misses: <span>${misses}</span></li>
      <li>Accuracy: <span>${accuracy}%</span></li>
    </ul>
  `;
};

// Hides game status related UI
const resetGameStatusUI = () => {
  gameSummary.container.style.visibility = 'hidden';
};

export {
  turnIndicator,
  renderGameMessage,
  initializeGameStatusUI,
  displayWinner,
  resetGameStatusUI,
};
