import activePlayer from './activePlayer';
import { playerStatsUI, gameStatusUI, gameSummary } from './selectors';

// Updates both players' status display name
const updatePlayerStatusName = (player1Name, player2Name) => {
  playerStatsUI.p1Name.textContent = player1Name;
  playerStatsUI.p2Name.textContent = player2Name;
};

// Updates a player's displayed HP
const updateHP = (playerName) => {
  const totalHP = Object.values(activePlayer.gameboard.ships).reduce(
    (total, ship) => total + ship.length,
    0,
  );

  const damage = +(1 / totalHP).toFixed(3) * 100;

  const playerHealth =
    playerName === playerStatsUI.p1Name.textContent
      ? playerStatsUI.p1Health
      : playerStatsUI.p2Health;

  const currentHP = parseFloat(playerHealth.dataset.hp);
  const newHP = Math.floor(Math.max(0, currentHP - damage));

  playerHealth.dataset.hp = newHP;
  playerHealth.style.width = `${newHP}%`;
  if (newHP < 40) playerHealth.style.backgroundColor = 'orange';
  if (newHP < 15) playerHealth.style.backgroundColor = 'red';
};

// Marks sunk ship from the player status' ships list
const updateShipsStatus = (playerName, ship) => {
  const player =
    playerName === playerStatsUI.p1Name.textContent
      ? playerStatsUI.p1Ships
      : playerStatsUI.p2Ships;

  const sunkShip = player.querySelector(`.${ship.name}`);

  sunkShip.textContent = '❌';
  sunkShip.style.filter = 'brightness(0.5)';
};

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
  updatePlayerStatusName,
  updateHP,
  updateShipsStatus,
  turnIndicator,
  renderGameMessage,
  initializeGameStatusUI,
  displayWinner,
  resetGameStatusUI,
};
