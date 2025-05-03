import ComputerPlayer from './computerPlayer';
import { GAME_MODES } from './constants';
import Player from './player';

const players = {
  player1: null,
  player2: null,
};

const initializePlayers = (mode) => {
  if (!players.player1 || !players.player2) {
    players.player1 = new Player();
    players.player2 =
      mode === GAME_MODES.VS_COMPUTER ? new ComputerPlayer() : new Player();
  }
};

const resetPlayers = () => {
  players.player1 = null;
  players.player2 = null;
};

export { players, initializePlayers, resetPlayers };
