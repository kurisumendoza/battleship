import initializeShips from './shipsConfig';
import { CELL_STATES, ORIENTATIONS } from './constants';

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
      (orientation === ORIENTATIONS.VERTICAL &&
        row + ship.length > this.board.length) ||
      (orientation === ORIENTATIONS.HORIZONTAL &&
        col + ship.length > this.board[0].length)
    )
      return { success: false, message: 'Out of bounds' };

    for (let i = 0; i < ship.length; i += 1) {
      const currentRow = row + (orientation === ORIENTATIONS.VERTICAL ? i : 0);
      const currentCol =
        col + (orientation === ORIENTATIONS.HORIZONTAL ? i : 0);
      const cell = `${currentRow}, ${currentCol}`;

      if (this.occupied.has(cell))
        return {
          success: false,
          message: 'Overlaps existing ship',
        };
    }

    for (let i = 0; i < ship.length; i += 1) {
      const currentRow = row + (orientation === ORIENTATIONS.VERTICAL ? i : 0);
      const currentCol =
        col + (orientation === ORIENTATIONS.HORIZONTAL ? i : 0);
      this.occupied.add(`${currentRow}, ${currentCol}`);
      ship.position.push([currentRow, currentCol]);
      this.board[currentRow][currentCol] = ship;
    }

    return { success: true };
  }

  // Removes a ship from the board and can be placed again
  removeShip(ship) {
    ship.position.forEach((coord) => {
      this.occupied.delete(coord.join(', '));
      this.board[coord[0]][coord[1]] = null;
    });

    ship.position.splice(0, ship.position.length);
  }

  // Updates board on successful and missed shots
  receiveAttack(coords) {
    const [row, col] = coords;

    if (
      this.hit.has(`${row},${col}`) ||
      this.board[row][col] === CELL_STATES.MISS
    )
      return { success: false, message: 'Cell has already been hit' };

    if (this.board[row][col] && this.board[row][col] !== CELL_STATES.MISS) {
      this.hit.add(`${row},${col}`);
      this.board[row][col].hit(); // if ship is present, this will be an instance of Ship
    } else {
      this.board[row][col] = CELL_STATES.MISS;
    }

    return { success: true };
  }

  // Checks if all available ships are placed on board
  isAllPlaced() {
    return Object.values(this.ships).every((ship) => ship.position.length > 0);
  }

  // Reports if all ships are sunk
  isAllSunk() {
    return Object.values(this.ships).every((ship) => ship.hasSunk);
  }
}

export default Gameboard;
