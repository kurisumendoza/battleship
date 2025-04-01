import { players, initializePlayers } from './createPlayers';
import { startScreen } from './selectors';

// Renders 10 x 10 gameboard
const renderGameboard = (board) => {
  for (let i = 0; i < 100; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    board.appendChild(cell);
  }
};

// Adjusts dialog UI for ship placement
const adjustBoardSetupDialog = () => {
  startScreen.title.style.fontSize = 'var(--header-font-size)';
  document.querySelector('.game-modes-container').remove();
};

// Renders board for ship placement
const renderShipPlacementBoard = () => {
  adjustBoardSetupDialog();

  const shipPlacementContainer = document.createElement('div');
  const shipPlacementBoard = document.createElement('div');

  shipPlacementContainer.classList.add('ship-placement-container');
  shipPlacementBoard.classList.add('ship-placement-board');

  startScreen.setupContainer.insertAdjacentElement(
    'beforeend',
    shipPlacementContainer,
  );
  shipPlacementContainer.appendChild(shipPlacementBoard);

  renderGameboard(shipPlacementBoard);
};

// Renders ships and ship information for setup
const renderShipSelection = (ships) => {
  const shipsContainer = document.createElement('div');
  shipsContainer.classList.add('ships-container');

  Object.entries(ships).forEach(([ship, { length }]) => {
    const shipEntry = document.createElement('div');
    const shipName = document.createElement('p');
    const shipHealth = document.createElement('span');
    const shipModel = document.createElement('div');

    shipEntry.classList.add('ship');
    shipModel.classList.add(`${ship}`, 'ship-model');

    shipName.textContent =
      `${ship}`.charAt(0).toUpperCase() + `${ship}`.slice(1);
    shipHealth.textContent = `HP: ${length}`;
    shipModel.style.width = `${length * 20}%`;
    shipModel.style.backgroundColor = `var(--${ship}-color)`;

    shipName.append(shipHealth);
    shipEntry.append(shipName, shipModel);
    shipsContainer.insertAdjacentElement('beforeend', shipEntry);
  });

  return shipsContainer;
};

// Renders the ship setup/selection section
const renderShipSetup = (ships) => {
  const shipSetupContainer = document.createElement('div');
  const shipSetupLabel = document.createElement('p');

  shipSetupContainer.classList.add('ship-setup-container');

  shipSetupLabel.innerText = 'Position your ships for battle!';

  startScreen.setupContainer.insertAdjacentElement(
    'beforeend',
    shipSetupContainer,
  );
  shipSetupContainer.append(shipSetupLabel, renderShipSelection(ships));
};

// Triggers multiple functions after game mode selection
const startShipPlacement = () => {
  initializePlayers('vsComputer');
  renderShipSetup(players.player1.gameboard.ships);
  renderShipPlacementBoard();
};

// Renders options to play against another player or computer
const renderGameModeOptions = () => {
  startScreen.startBtn.remove();

  const gameModesContainer = document.createElement('div');
  const vsPlayer = document.createElement('button');
  const vsComputer = document.createElement('button');

  gameModesContainer.classList.add('game-modes-container');
  vsPlayer.classList.add('vs-player');
  vsComputer.classList.add('vs-computer');

  vsPlayer.textContent = 'VS Player';
  vsComputer.textContent = 'VS Computer';

  gameModesContainer.append(vsPlayer, vsComputer);
  startScreen.setupContainer.appendChild(gameModesContainer);

  vsPlayer.addEventListener('click', () => {});
  vsComputer.addEventListener('click', startShipPlacement);
};

export { renderGameboard, renderGameModeOptions, renderShipPlacementBoard };
