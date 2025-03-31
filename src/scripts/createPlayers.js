import Player from './player';

const players = {
  player1: null,
  player2: null,
};

const initializePlayers = (mode) => {
  if (!players.player1 || !players.player2) {
    players.player1 = new Player();
    players.player2 = mode === 'vsComputer' ? new Player(true) : new Player();
  }
};

export { initializePlayers, players };
