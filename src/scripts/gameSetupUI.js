import { renderGameboard } from './gameplayUI';
import { startScreen } from './selectors';
import createElement from './helpers';
import { CELL_STATES, GAME_MODES, ORIENTATIONS } from './constants';

// Stores initial HTML structure
const initialHTML = startScreen.setupContainer.innerHTML;

// Helper function for adjusting dialog's UI for ship placement
const adjustBoardSetupDialog = () => {
  startScreen.title.style.fontSize = 'var(--header-font-size)';
  startScreen.setupContainer.innerHTML = '';
};

// Renders ships and ship information for setup
const renderShipSelection = (ships) => {
  adjustBoardSetupDialog();

  const shipsContainer = createElement('div', ['ships-container']);

  Object.entries(ships).forEach(([ship, { length }]) => {
    const shipEntry = createElement('div', ['ship']);
    const shipName = createElement('p', ['ship-name']);
    const shipHealth = createElement('p', ['ship-health']);
    const shipBtns = createElement('div', ['ship-btns']);
    const orientationBtn = createElement('button', ['change-orientation-btn']);
    const undoBtn = createElement('button', ['undo-btn']);
    const shipModel = createElement('div', [`${ship}`, 'ship-model']);

    shipName.textContent =
      `${ship}`.charAt(0).toUpperCase() + `${ship}`.slice(1);
    shipHealth.textContent = `HP: ${length}`;
    orientationBtn.textContent = '↔';
    undoBtn.textContent = '↺';

    shipEntry.dataset.ship = ship;
    orientationBtn.dataset.orientation = ORIENTATIONS.HORIZONTAL;

    shipModel.style.width = `${length * 20}%`;

    shipBtns.append(orientationBtn, undoBtn);
    shipEntry.append(shipName, shipHealth, shipBtns, shipModel);
    shipsContainer.appendChild(shipEntry);
  });

  return shipsContainer;
};

// Renders section for ship setup/selection
const renderShipSetup = (ships) => {
  const shipSetupContainer = createElement('div', ['ship-setup-container']);
  const shipSetupLabel = createElement('p', ['ship-setup-label']);
  const shipsContainer = renderShipSelection(ships);

  shipSetupLabel.textContent = 'Position your ships!';

  startScreen.setupContainer.appendChild(shipSetupContainer);
  shipSetupContainer.append(shipSetupLabel, shipsContainer);

  return shipsContainer;
};

// Renders board for ship placement
const renderShipPlacementBoard = (playerBoard) => {
  const shipPlacementContainer = createElement('div', [
    'ship-placement-container',
  ]);
  const shipPlacementBoard = createElement('div', ['ship-placement-board']);

  startScreen.setupContainer.appendChild(shipPlacementContainer);
  shipPlacementContainer.appendChild(shipPlacementBoard);

  renderGameboard(shipPlacementBoard, playerBoard);

  return shipPlacementBoard;
};

// Renders an input where players can enter their desired name
const renderPlayerNameInput = () => {
  const inputNameLabel = createElement('p', ['input-name-label']);
  const inputName = createElement('input', ['input-name']);

  inputNameLabel.textContent = 'Enter your name:';
  inputName.placeholder = 'ex: Altria';
  inputName.style.fontSize = '1.25rem';

  return { inputNameLabel, inputName };
};

// Renders button to start game or pass setup to another player
const renderActionBtn = (mode) => {
  const actionBtnContainer = createElement('div', ['action-btn-container']);
  const actionBtn = createElement('button', ['action-btn']);

  actionBtn.textContent =
    mode === GAME_MODES.VS_PLAYER ? 'Next Player' : 'Start Game';

  actionBtnContainer.appendChild(actionBtn);

  return { actionBtnContainer, actionBtn };
};

// Renders section for player name input and game start button or next player button
const renderPlayerSetup = (mode) => {
  const nameAndActionBtnContainer = createElement('div', [
    'name-start-container',
  ]);
  const errorContainer = createElement('div', ['error-container']);
  const { inputNameLabel, inputName } = renderPlayerNameInput();

  const { actionBtnContainer, actionBtn } = renderActionBtn(mode);

  startScreen.setupContainer.appendChild(nameAndActionBtnContainer);
  nameAndActionBtnContainer.append(
    inputNameLabel,
    inputName,
    actionBtnContainer,
    errorContainer,
  );

  return { inputName, actionBtn, errorContainer };
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

// Updates the display of a cell where a ship is placed or removed
const updateShipCellsUI = (ship, name, isPlaced) => {
  ship.position.forEach((cell) => {
    const [row, col] = cell;
    const targetCell = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`,
    );

    if (!isPlaced) targetCell.classList.remove(CELL_STATES.HAS_SHIP, name);
    else targetCell.classList.add(CELL_STATES.HAS_SHIP, name);
  });
};

// Shows ship preview while hovering on board as placement guide
const handlePlacementHover = (ship, orientation, cell, isHovering = true) => {
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  const isHorizontal = orientation === ORIENTATIONS.HORIZONTAL;

  let hoveredRow = row;
  let hoveredCol = col;

  for (let i = 0; i < ship.length; i += 1) {
    hoveredRow = isHorizontal ? row : row + i;
    hoveredCol = isHorizontal ? col + i : col;

    if (hoveredRow > 9 || hoveredCol > 9) return;

    const hoveredCell = document.querySelector(
      `[data-row="${hoveredRow}"][data-col="${hoveredCol}"]`,
    );

    if (isHovering) {
      hoveredCell.style.transform = 'scale(1.25)';
      hoveredCell.style.backgroundColor = 'gray';
      hoveredCell.style.transition = '0ms';
    } else {
      hoveredCell.style.transform = '';
      hoveredCell.style.backgroundColor = '';
    }
  }
};

// Renders start screen again when Play Button is clicked
const rerenderStartScreen = () => {
  startScreen.title.style.fontSize = '';
  startScreen.setupContainer.innerHTML = '';

  startScreen.setupContainer.innerHTML = initialHTML;
};

export {
  renderGameModeOptions,
  renderShipSetup,
  renderShipPlacementBoard,
  renderPlayerSetup,
  updateShipCellsUI,
  handlePlacementHover,
  rerenderStartScreen,
};
