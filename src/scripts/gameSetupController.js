import { startScreen } from './selectors';
import { updateGameboard } from './gameplayUI';
import { players, initializePlayers } from './createPlayers';
import {
  renderGameModeOptions,
  renderShipSetup,
  renderShipPlacementBoard,
  renderNameInputAndStartBtn,
} from './gameSetupUI';

const initializeGame = () => {
  if (startScreen.dialog) startScreen.dialog.showModal();
};

// Updates the state of a cell where a ship is placed
const updatePlacedShipCells = (ship) => {
  ship.position.forEach((cell) => {
    const [row, col] = cell;
    updateGameboard(row, col, 'hasShip');
  });
};

// Temporary function for parameters, to be deleted later
const returnRequiredParameters = () => {
  const player = players.player1.gameboard;
  const ship = player.ships.carrier;
  const orientation = 'vertical';

  return [player, ship, orientation];
};

// Calls placeShip method with extracted row and col from a clicked cell
const placeShipOnBoard = (e, player, ship, orientation) => {
  if (!e.target.closest('.cell')) return;

  const row = Number(e.target.dataset.row);
  const col = Number(e.target.dataset.col);

  player.placeShip(ship, [row, col], orientation);

  updatePlacedShipCells(ship);
};

// Adds event listener to received ship placement board
const initializeShipPlacementBoard = (playerBoard) => {
  const board = renderShipPlacementBoard(playerBoard);

  board.addEventListener('click', (e) =>
    placeShipOnBoard(e, ...returnRequiredParameters()),
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
  renderShipSetup(players.player1.gameboard.ships);
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
