import initializeShips from './shipsConfig';

class Gameboard {
  constructor() {
    this.board = new Array(10).fill(null).map(() => new Array(10).fill(null));
    this.ships = initializeShips();
  }

  // Places specified ships on the board
  placeShip(ship, start, orientation) {
    const [row, col] = start;

    for (let i = 0; i < ship.length; i += 1) {
      this.board[row + (orientation === 'vertical' ? i : 0)][
        col + (orientation === 'horizontal' ? i : 0)
      ] = ship;
    }
  }
}

export default Gameboard;
