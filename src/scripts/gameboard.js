import initializeShips from './shipsConfig';

class Gameboard {
  constructor() {
    this.board = new Array(10).fill(null).map(() => new Array(10).fill(null));
    this.ships = initializeShips();
    this.occupied = new Set();
    this.hit = new Set();
  }

  // Places specified ships on the board
  placeShip(ship, start, orientation) {
    const [row, col] = start;

    if (
      (orientation === 'vertical' && row + ship.length > this.board.length) ||
      (orientation === 'horizontal' && col + ship.length > this.board[0].length)
    )
      throw new Error('Invalid placement: Out of bounds');

    for (let i = 0; i < ship.length; i += 1) {
      const currentRow = row + (orientation === 'vertical' ? i : 0);
      const currentCol = col + (orientation === 'horizontal' ? i : 0);
      const cell = `${currentRow}, ${currentCol}`;

      if (this.occupied.has(cell))
        throw new Error('Invalid placement: Overlaps existing ship');
    }

    for (let i = 0; i < ship.length; i += 1) {
      const currentRow = row + (orientation === 'vertical' ? i : 0);
      const currentCol = col + (orientation === 'horizontal' ? i : 0);
      this.occupied.add(`${currentRow}, ${currentCol}`);
      ship.position.push([currentRow, currentCol]);
      this.board[currentRow][currentCol] = ship;
    }
  }

  // Updates board on successful and missed shots
  receiveAttack(coords) {
    const [row, col] = coords;

    if (this.hit.has(`${row},${col}`) || this.board[row][col] === 'miss')
      throw new Error('Cell has already been hit');

    if (this.board[row][col] && this.board[row][col] !== 'miss') {
      this.hit.add(`${row},${col}`);
      this.board[row][col].hit(); // if ship is present, this will be an instance of Ship
    } else {
      this.board[row][col] = 'miss';
    }
  }

  // Reports if all ships are sunk
  isAllSunk() {
    return Object.values(this.ships).every((ship) => ship.hasSunk);
  }
}

export default Gameboard;
