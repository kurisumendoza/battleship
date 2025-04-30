import Gameboard from './gameboard';

class Player {
  constructor(isComputer = false) {
    this.isComputer = isComputer;
    this.gameboard = new Gameboard();
    this.name = isComputer ? 'Computer' : '';
    this.hitStreak = 0;
  }
}

export default Player;
