import renderGameboard from './gameplayUI';
import { startScreen } from './selectors';
import { createElement } from './helpers';

// Helper function for adjusting dialog's UI for ship placement
const adjustBoardSetupDialog = () => {
  startScreen.title.style.fontSize = 'var(--header-font-size)';
  document.querySelector('.game-modes-container').remove();
};

// Renders board for ship placement
const renderShipPlacementBoard = () => {
  adjustBoardSetupDialog();

  const shipPlacementContainer = createElement('div', [
    'ship-placement-container',
  ]);
  const shipPlacementBoard = createElement('div', ['ship-placement-board']);

  startScreen.setupContainer.appendChild(shipPlacementContainer);
  shipPlacementContainer.appendChild(shipPlacementBoard);

  renderGameboard(shipPlacementBoard);
};

// Renders ships and ship information for setup
const renderShipSelection = (ships) => {
  const shipsContainer = createElement('div', ['ships-container']);

  Object.entries(ships).forEach(([ship, { length }]) => {
    const shipEntry = createElement('div', ['ship']);
    const shipName = createElement('p');
    const shipHealth = createElement('span');
    const shipModel = createElement('div', [`${ship}`, 'ship-model']);

    shipName.textContent =
      `${ship}`.charAt(0).toUpperCase() + `${ship}`.slice(1);
    shipHealth.textContent = `HP: ${length}`;

    shipModel.style.width = `${length * 20}%`;
    shipModel.style.backgroundColor = `var(--${ship}-color)`;

    shipName.appendChild(shipHealth);
    shipEntry.append(shipName, shipModel);
    shipsContainer.appendChild(shipEntry);
  });

  return shipsContainer;
};

// Renders section for ship setup/selection
const renderShipSetup = (ships) => {
  const shipSetupContainer = createElement('div', ['ship-setup-container']);
  const shipSetupLabel = createElement('p');

  shipSetupLabel.textContent = 'Position your ships for battle!';

  startScreen.setupContainer.appendChild(shipSetupContainer);
  shipSetupContainer.append(shipSetupLabel, renderShipSelection(ships));
};

// Renders an input where players can enter their desired name
const renderPlayerNameInput = () => {
  const inputNameLabel = createElement('p');
  const inputName = createElement('input', ['input-name']);

  inputNameLabel.textContent = 'Enter your name';

  return { inputNameLabel, inputName };
};

// Renders button to start game or pass setup to another player
const renderStartGameBtn = () => {
  const startContainer = createElement('div', ['start-game-container']);
  const startBtn = createElement('button', ['start-game-btn']);

  startBtn.textContent = 'Start Game';

  startContainer.appendChild(startBtn);

  return { startContainer, startBtn };
};

// Renders section for player name input and game start button
const renderNameInputAndStartBtn = () => {
  const nameAndStartContainer = createElement('div', ['name-start-container']);
  const { inputNameLabel, inputName } = renderPlayerNameInput();
  const { startContainer, startBtn } = renderStartGameBtn();

  startScreen.setupContainer.appendChild(nameAndStartContainer);
  nameAndStartContainer.append(inputNameLabel, inputName, startContainer);

  return { inputName, startBtn };
};

// Renders options to play against another player or computer
const renderGameModeOptions = () => {
  startScreen.startBtn.remove();

  const gameModesContainer = createElement('div', ['game-modes-container']);
  const vsPlayerBtn = createElement('button', ['vs-player']);
  const vsComputerBtn = createElement('button', ['vs-computer']);

  vsPlayerBtn.textContent = 'VS Player';
  vsComputerBtn.textContent = 'VS Computer';

  gameModesContainer.append(vsPlayerBtn, vsComputerBtn);
  startScreen.setupContainer.appendChild(gameModesContainer);

  return { vsPlayerBtn, vsComputerBtn };
};

export {
  renderGameModeOptions,
  renderShipSetup,
  renderShipPlacementBoard,
  renderNameInputAndStartBtn,
};
