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

  shipPlacementBoard.classList.add('ship-placement-board');
  shipPlacementContainer.classList.add('ship-placement-container');

  startScreen.setupContainer.appendChild(shipPlacementContainer);
  shipPlacementContainer.appendChild(shipPlacementBoard);

  renderGameboard(shipPlacementBoard);
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
  vsComputer.addEventListener('click', renderShipPlacementBoard);
};

export { renderGameboard, renderGameModeOptions, renderShipPlacementBoard };
