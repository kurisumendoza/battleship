import { players } from './createPlayers';

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

export default activePlayer;
