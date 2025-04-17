import { startScreen } from './selectors';
import { initializePlayers } from './createPlayers';
import activePlayer from './activePlayer';
import launchGame from './gameplayController';
import {
  renderGameModeOptions,
  renderShipSetup,
  renderShipPlacementBoard,
  renderPlayerSetup,
  updateShipCellsUI,
} from './gameSetupUI';
import { renderErrorMsg } from './gameplayUI';

// Stores recently picked ship information
const pickedShip = {
  ship: null,
  name: null,
  orientation: null,
};

const initializeGame = () => {
  if (startScreen.dialog) startScreen.dialog.showModal();
};

// Picks a ship to place on board
const pickShipToPlace = (e) => {
  if (e.target.classList.contains('is-placed')) return;
  if (pickedShip.ship) return;

  const shipName = e.target.closest('[data-ship]')?.dataset.ship;
  pickedShip.ship = activePlayer.gameboard.ships[shipName];
  pickedShip.name = shipName;
  pickedShip.orientation = e.target
    .closest('[data-ship]')
    .querySelector('[data-orientation]').dataset.orientation;

  e.target.classList.add('is-placed');
};

// Toggles ship orientation by clicking a button
const changeOrientation = (e) => {
  if (pickedShip.orientation) return;

  if (e.target.dataset.orientation === 'horizontal') {
    e.target.textContent = '↕';
    e.target.dataset.orientation = 'vertical';
  } else {
    e.target.textContent = '↔';
    e.target.dataset.orientation = 'horizontal';
  }
};

// Removes ship from board so it can be placed again
const resetShipPlacement = (e) => {
  const shipName = e.target.closest('[data-ship]').dataset.ship;
  const ship = activePlayer.gameboard.ships[shipName];
  const shipModel = e.target
    .closest('[data-ship]')
    .querySelector('.ship-model');

  updateShipCellsUI(ship, shipName, false);
  activePlayer.gameboard.removeShip(ship);
  shipModel.classList.remove('is-placed');
};

// Adds event listeners to shipsContainer elements
const initializeShipSetup = (ships) => {
  const shipsContainer = renderShipSetup(ships);

  shipsContainer.addEventListener('click', (e) => {
    if (!e.target.closest('[data-ship]')) return;

    if (e.target.classList.contains('ship-model')) pickShipToPlace(e);
    if (e.target.classList.contains('change-orientation-btn'))
      changeOrientation(e);
    if (e.target.classList.contains('undo-btn')) resetShipPlacement(e);
  });
};

// Calls placeShip method with extracted row and col from a clicked cell
const placeShipOnBoard = (e, ship, orientation) => {
  if (!e.target.closest('.cell')) return;
  if (!pickedShip.ship) return;

  const row = Number(e.target.dataset.row);
  const col = Number(e.target.dataset.col);

  const placeShip = activePlayer.gameboard.placeShip(
    ship,
    [row, col],
    orientation,
  );
  // Change behavior later to reflect on UI
  if (!placeShip.success) return;

  updateShipCellsUI(ship, pickedShip.name, true);

  pickedShip.ship = null;
  pickedShip.name = null;
  pickedShip.orientation = null;
};

// Adds event listener to received ship placement board
const initializeShipPlacementBoard = (playerBoard) => {
  const board = renderShipPlacementBoard(playerBoard);

  board.addEventListener('click', (e) =>
    placeShipOnBoard(e, pickedShip.ship, pickedShip.orientation),
  );
};

const playerSetup = {
  // Adds event listener to received action button
  initialize(mode) {
    const { inputName, actionBtn, errorContainer } = renderPlayerSetup(mode);

    actionBtn.addEventListener('click', () =>
      this.validate(mode, inputName.value, errorContainer),
    );
  },

  // Validates setup before passing to next player or starting game
  validate(mode, name, errContainer) {
    if (!activePlayer.gameboard.isAllPlaced())
      return renderErrorMsg(errContainer, 'Place all ships on board!');

    if (!name) return renderErrorMsg(errContainer, 'Please enter a name!');

    if (mode === 'vsComputer' || mode === 'nextPlayer') return this.startGame();

    return this.nextPlayer(mode);
  },

  // Ends setup phase and starts the game
  startGame() {
    startScreen.dialog.close();
    launchGame();
  },

  // Ends active player's setup phase and passes it to the next player
  nextPlayer() {
    activePlayer.switch();
    initializeShipSetup(activePlayer.gameboard.ships);
    initializeShipPlacementBoard(activePlayer.gameboard.board);
    this.initialize('nextPlayer');
  },
};

// Calls functions to render UI of ship placement phase
const startShipPlacementPhase = (mode) => {
  initializePlayers(mode);
  activePlayer.assign();
  initializeShipSetup(activePlayer.gameboard.ships);
  initializeShipPlacementBoard(activePlayer.gameboard.board);
  playerSetup.initialize(mode);
};

// Adds event listeners to received vsPlayer and vsComputer buttons
const initializeGameModeOptions = () => {
  const { vsPlayerBtn, vsComputerBtn } = renderGameModeOptions();

  vsPlayerBtn.addEventListener('click', () =>
    startShipPlacementPhase('vsPlayer'),
  );
  vsComputerBtn.addEventListener('click', () =>
    startShipPlacementPhase('vsComputer'),
  );
};

startScreen.startBtn.addEventListener('click', initializeGameModeOptions);

export default initializeGame;
