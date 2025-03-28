import Player from './player';

let player1;
let player2;

const initializePlayers = (mode) => {
  if (!player1 || !player2) {
    player1 = new Player();
    player2 = mode === 'vsComputer' ? new Player(true) : new Player();
  }
};

const getPlayers = () => ({ player1, player2 });

export { initializePlayers, getPlayers };
