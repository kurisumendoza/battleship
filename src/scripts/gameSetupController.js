import { startScreen } from './selectors';
import { players, initializePlayers } from './createPlayers';
import launchGame from './gameplayController';
import {
  renderGameModeOptions,
  renderShipSetup,
  renderShipPlacementBoard,
  renderNameInputAndStartBtn,
  updateShipCellsUI,
} from './gameSetupUI';
import { renderErrorMsg } from './gameplayUI';

// Assigns and stores active player and ability to switch to another player
const activePlayer = {
  player: null,
  gameboard: null,
  assign() {
    this.player = players.player1;
    this.gameboard = this.player.gameboard;
  },
  switch() {
    this.player =
      this.player === players.player1 ? players.player2 : players.player1;
    this.gameboard = this.player.gameboard;
  },
};

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

  activePlayer.gameboard.placeShip(ship, [row, col], orientation);

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

// Ends setup phase and starts the game
const startGame = (name, errContainer) => {
  if (!activePlayer.gameboard.isAllPlaced())
    return renderErrorMsg(errContainer, 'Place all ships on board!');

  if (!name) return renderErrorMsg(errContainer, 'Please enter a name!');

  startScreen.dialog.close();

  launchGame();

  return undefined;
};

// Adds event listeners to received name input and start button
const initializeNameInputAndStartBtn = () => {
  const { inputName, startBtn, errorContainer } = renderNameInputAndStartBtn();

  startBtn.addEventListener('click', () =>
    startGame(inputName.value, errorContainer),
  );
};

// Calls functions to render UI of ship placement phase
const startShipPlacementPhase = (mode) => {
  initializePlayers(mode);
  activePlayer.assign();
  initializeShipSetup(activePlayer.gameboard.ships);
  initializeShipPlacementBoard(activePlayer.gameboard.board);
  initializeNameInputAndStartBtn();
};

// Adds event listeners to received vsPlayer and vsComputer buttons
const initializeGameModeOptions = () => {
  const { vsPlayerBtn, vsComputerBtn } = renderGameModeOptions();

  vsPlayerBtn.addEventListener('click', () => {
    // Logic to be added later
  });
  vsComputerBtn.addEventListener('click', () =>
    startShipPlacementPhase('vsComputer'),
  );
};

startScreen.startBtn.addEventListener('click', initializeGameModeOptions);

export default initializeGame;
