import { startScreen } from './selectors';
import { initializePlayers } from './createPlayers';
import activePlayer from './activePlayer';
import { startTurn } from './gameplayController';
import { renderErrorMsg } from './gameplayUI';
import renderLoadingScreen from './loadingScreen';
import {
  COMPUTER_PLAYER,
  GAME_MODES,
  NEXT_PLAYER,
  ORIENTATIONS,
} from './constants';
import {
  renderGameModeOptions,
  renderShipSetup,
  renderShipPlacementBoard,
  renderPlayerSetup,
  updateShipCellsUI,
  handlePlacementHover,
} from './gameSetupUI';
import { updatePlayerStatusName } from './gameStatusUI';

// Stores recently picked ship information
const pickedShip = {
  ship: null,
  name: null,
  orientation: null,
};

const resetPickedShip = () => {
  pickedShip.ship = null;
  pickedShip.name = null;
  pickedShip.orientation = null;
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

  if (e.target.dataset.orientation === ORIENTATIONS.HORIZONTAL) {
    e.target.textContent = '↕';
    e.target.dataset.orientation = ORIENTATIONS.VERTICAL;
  } else {
    e.target.textContent = '↔';
    e.target.dataset.orientation = ORIENTATIONS.HORIZONTAL;
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
  resetPickedShip();
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

// Shows/Clears ship placement preview on board
const handleHoverShipOnBoard = (e, ship, orientation, isHovering = true) => {
  if (!e.target.closest('.cell')) return;
  if (!pickedShip.ship) return;

  handlePlacementHover(ship, orientation, e.target, isHovering);
};

// Calls placeShip method with extracted row and col from a clicked cell
const placeShipOnBoard = (e, ship, orientation) => {
  if (!e.target.closest('.cell')) return;
  if (!pickedShip.ship) return;

  handlePlacementHover(ship, orientation, e.target, false);

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

  resetPickedShip();
};

// Adds event listener to received ship placement board
const initializeShipPlacementBoard = (playerBoard) => {
  const board = renderShipPlacementBoard(playerBoard);

  board.addEventListener('click', (e) =>
    placeShipOnBoard(e, pickedShip.ship, pickedShip.orientation),
  );
  board.addEventListener('mouseover', (e) =>
    handleHoverShipOnBoard(e, pickedShip.ship, pickedShip.orientation),
  );
  board.addEventListener('mouseout', (e) =>
    handleHoverShipOnBoard(e, pickedShip.ship, pickedShip.orientation, false),
  );
  board.addEventListener('touchstart', (e) =>
    handleHoverShipOnBoard(e, pickedShip.ship, pickedShip.orientation),
  );
  board.addEventListener('touchend', (e) =>
    handleHoverShipOnBoard(e, pickedShip.ship, pickedShip.orientation, false),
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

  // Checks name's validity
  validateName(name) {
    if (!name) return { valid: false, message: 'Please enter a name!' };

    if (
      name === COMPUTER_PLAYER ||
      name === COMPUTER_PLAYER.toLowerCase() ||
      name === COMPUTER_PLAYER.toUpperCase()
    )
      return { valid: false, message: "Name cannot be 'Computer'!" };

    if (name.trim().replace(/\s+/g, ' ').length < 2)
      return {
        valid: false,
        message: 'Name too short! Name should be at least 2 characters long.',
      };

    if (name.trim().replace(/\s+/g, ' ').length > 15)
      return {
        valid: false,
        message: 'Name too long! Name should be no longer than 12 characters.',
      };

    return { valid: true, name: name.trim().replace(/\s+/g, ' ') };
  },

  // Validates setup before passing to next player or starting game
  validate(mode, name, errContainer) {
    if (!activePlayer.gameboard.isAllPlaced())
      return renderErrorMsg(errContainer, 'Place all ships on board!');

    const validatedName = this.validateName(name);

    if (!validatedName.valid)
      return renderErrorMsg(errContainer, validatedName.message);

    if (mode === GAME_MODES.VS_COMPUTER || mode === NEXT_PLAYER)
      return this.startGame(validatedName.name, mode);

    return this.nextPlayer(validatedName.name);
  },

  // Saves the player's name to the Player class
  saveName(name) {
    activePlayer.player.name = name;
  },

  // Ends setup phase and starts the game
  startGame(name, mode) {
    this.saveName(name);
    if (mode !== GAME_MODES.VS_COMPUTER) {
      activePlayer.switch();
      renderLoadingScreen();
    }

    if (mode === GAME_MODES.VS_COMPUTER) {
      activePlayer.opponent.autoPlaceShips();
    }

    startScreen.dialog.close();
    updatePlayerStatusName(
      activePlayer.player.name,
      activePlayer.opponent.name,
    );
    startTurn();
  },

  // Ends active player's setup phase and passes it to the next player
  nextPlayer(name) {
    renderLoadingScreen();
    this.saveName(name);
    activePlayer.switch();
    initializeShipSetup(activePlayer.gameboard.ships);
    initializeShipPlacementBoard(activePlayer.gameboard);
    this.initialize(NEXT_PLAYER);
  },
};

// Calls functions to render UI of ship placement phase
const startShipPlacementPhase = (mode) => {
  initializePlayers(mode);
  activePlayer.assign();
  initializeShipSetup(activePlayer.gameboard.ships);
  initializeShipPlacementBoard(activePlayer.gameboard);
  playerSetup.initialize(mode);
};

// Adds event listeners to received vsPlayer and vsComputer buttons
const initializeGameModeOptions = () => {
  const { vsPlayerBtn, vsComputerBtn } = renderGameModeOptions();

  vsPlayerBtn.addEventListener('click', () =>
    startShipPlacementPhase(GAME_MODES.VS_PLAYER),
  );
  vsComputerBtn.addEventListener('click', () =>
    startShipPlacementPhase(GAME_MODES.VS_COMPUTER),
  );
};

const initializeGame = () => {
  if (startScreen.dialog) startScreen.dialog.showModal();
  startScreen.startBtn = document.querySelector('.start-new-game');
  startScreen.startBtn.addEventListener('click', initializeGameModeOptions);
};

export default initializeGame;
