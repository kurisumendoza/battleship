import Gameboard from './gameboard';

class Player {
  constructor(isComputer = false) {
    this.isComputer = isComputer;
    this.gameboard = new Gameboard();
  }
}

export default Player;
