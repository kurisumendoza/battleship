import { players } from './createPlayers';

// Assigns and stores active player and ability to switch to another player
const activePlayer = {
  player: null,
  gameboard: null,
  opponent: null,
  oppGameboard: null,
  assign() {
    this.player = players.player1;
    this.gameboard = this.player.gameboard;
    this.opponent = players.player2;
    this.oppGameboard = this.opponent.gameboard;
  },
  switch() {
    [this.player, this.opponent] = [this.opponent, this.player];
    this.gameboard = this.player.gameboard;
    this.oppGameboard = this.opponent.gameboard;
  },
};

export default activePlayer;
