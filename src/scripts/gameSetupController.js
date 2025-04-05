import { startScreen, gameboardUI } from './selectors';
import renderGameboard from './gameplayUI';
import { players, initializePlayers } from './createPlayers';
import {
  renderGameModeOptions,
  renderShipSetup,
  renderShipPlacementBoard,
  renderNameInputAndStartBtn,
} from './gameSetupUI';

const initializeGame = () => {
  if (startScreen.dialog) startScreen.dialog.showModal();
  renderGameboard(gameboardUI.board);
  renderGameboard(gameboardUI.enemyBoard);
};

// Adds event listeners to received name input and start button
const handleNameInputAndStartBtn = () => {
  const { inputName, startBtn } = renderNameInputAndStartBtn();

  inputName.addEventListener('click', () => {
    // Logic to be added later
  });
  startBtn.addEventListener('click', () => {
    startScreen.dialog.close();
    // renderGameboard from initializeGame will be moved here later
  });
};

// Calls functions to render UI of ship placement phase
const handleStartShipPlacement = (mode) => {
  initializePlayers(mode);
  renderShipSetup(players.player1.gameboard.ships);
  renderShipPlacementBoard();
  handleNameInputAndStartBtn();
};

// Adds event listeners to received vsPlayer and vsComputer buttons
const handleGameModeOptions = () => {
  const { vsPlayerBtn, vsComputerBtn } = renderGameModeOptions();

  vsPlayerBtn.addEventListener('click', () => {
    // Logic to be added later
  });
  vsComputerBtn.addEventListener('click', () =>
    handleStartShipPlacement('vsComputer'),
  );
};

startScreen.startBtn.addEventListener('click', handleGameModeOptions);

export default initializeGame;
