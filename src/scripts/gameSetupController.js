import { startScreen } from './selectors';
import { players, initializePlayers } from './createPlayers';
import {
  renderGameModeOptions,
  renderShipSetup,
  renderShipPlacementBoard,
  renderNameInputAndStartBtn,
  renderPlacedShipCells,
} from './gameSetupUI';

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
  if (e.target.dataset.orientation === 'horizontal') {
    e.target.textContent = '↕';
    e.target.dataset.orientation = 'vertical';
  } else {
    e.target.textContent = '↔';
    e.target.dataset.orientation = 'horizontal';
  }
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

  renderPlacedShipCells(ship, pickedShip.name);

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

// Adds event listeners to received name input and start button
const initializeNameInputAndStartBtn = () => {
  const { inputName, startBtn } = renderNameInputAndStartBtn();

  inputName.addEventListener('click', () => {
    // Logic to be added later
  });
  startBtn.addEventListener('click', () => {
    startScreen.dialog.close();
    // Additional logic to be added later
  });
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
