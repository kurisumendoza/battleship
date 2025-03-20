import initializeShips from './shipsConfig';

class Gameboard {
  constructor() {
    this.board = new Array(10).fill(null).map(() => new Array(10).fill(null));
    this.ships = initializeShips();
  }
}

export default Gameboard;
