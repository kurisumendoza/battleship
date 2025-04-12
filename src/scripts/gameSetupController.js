import { startScreen } from './selectors';
import { players, initializePlayers } from './createPlayers';
import {
  renderGameModeOptions,
  renderShipSetup,
  renderShipPlacementBoard,
  renderNameInputAndStartBtn,
  renderPlacedShipCells,
} from './gameSetupUI';

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
const pickShipToPlace = (e, player) => {
  if (e.target.classList.contains('is-placed')) return;

  const shipName = e.target.closest('[data-ship]')?.dataset.ship;
  pickedShip.ship = player.ships[shipName];
  pickedShip.name = shipName;
  pickedShip.orientation = e.target
    .closest('[data-ship]')
    .querySelector('[data-orientation]').dataset.orientation;

  e.target.classList.add('is-placed');
};

// Adds event listeners to shipsContainer elements
const initializeShipSetup = (ships) => {
  const shipsContainer = renderShipSetup(ships);

  shipsContainer.addEventListener('click', (e) => {
    if (!e.target.closest('[data-ship]')) return;

    if (e.target.classList.contains('ship-model'))
      pickShipToPlace(e, players.player1.gameboard);
    if (e.target.classList.contains('change-orientation-btn')) {
      /* Logic to be added later */
    }
    if (e.target.classList.contains('undo-btn')) {
      /* Logic to be added later */
    }
  });
};

// Calls placeShip method with extracted row and col from a clicked cell
const placeShipOnBoard = (e, player, ship, orientation) => {
  if (!e.target.closest('.cell')) return;
  if (!pickedShip.ship) return;

  const row = Number(e.target.dataset.row);
  const col = Number(e.target.dataset.col);

  player.placeShip(ship, [row, col], orientation);

  renderPlacedShipCells(ship, pickedShip.name);

  pickedShip.ship = null;
  pickedShip.name = null;
  pickedShip.orientation = null;
};

// Adds event listener to received ship placement board
const initializeShipPlacementBoard = (playerBoard) => {
  const board = renderShipPlacementBoard(playerBoard);

  board.addEventListener('click', (e) =>
    placeShipOnBoard(
      e,
      players.player1.gameboard,
      pickedShip.ship,
      pickedShip.orientation,
    ),
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
  initializeShipSetup(players.player1.gameboard.ships);
  initializeShipPlacementBoard(players.player1.gameboard.board);
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
