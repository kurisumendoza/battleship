import initializeShips from './shipsConfig';

class Gameboard {
  constructor() {
    this.board = new Array(10).fill(null).map(() => new Array(10).fill(null));
    this.ships = initializeShips();
  }

  // Places specified ships on the board
  placeShip(ship, start, orientation) {
    const [row, col] = start;

    if (
      (orientation === 'vertical' && row + ship.length > this.board.length) ||
      (orientation === 'horizontal' && col + ship.length > this.board[0].length)
    )
      throw new Error('Out of bounds');

    for (let i = 0; i < ship.length; i += 1) {
      this.board[row + (orientation === 'vertical' ? i : 0)][
        col + (orientation === 'horizontal' ? i : 0)
      ] = ship;
    }
  }
}

export default Gameboard;
