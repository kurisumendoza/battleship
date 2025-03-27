import toggleElement from './helpers';
import { controlsUI, gameSetup } from './selectors';

// Renders 10 x 10 gameboard
export const renderGameboard = (gameboard) => {
  for (let i = 0; i < 100; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gameboard.appendChild(cell);
  }
};

// Renders options to play against another player or computer
export const renderGameModeOptions = () => {
  toggleElement(controlsUI.startGame, 'none');

  const vsPlayer = document.createElement('button');
  const vsComputer = document.createElement('button');
  vsPlayer.classList.add('vs-player');
  vsComputer.classList.add('vs-computer');
  vsPlayer.textContent = 'VS Player';
  vsComputer.textContent = 'VS Computer';
  gameSetup.append(vsPlayer, vsComputer);
};
