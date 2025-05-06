import Player from './player';
import { COMPUTER_PLAYER, ORIENTATIONS, SHIP_OFFSETS } from './constants';

class ComputerPlayer extends Player {
  constructor() {
    super();
    this.name = COMPUTER_PLAYER;
    this.restrictedCells = new Set();
    this.lastHit = null; // stores last successful hit
    this.nextHit = null; // stores successful hit adjacent to lastHit
  }

  // Automatically place all ships in the computer player's gameboard
  autoPlaceShips() {
    Object.values(this.gameboard.ships).forEach((ship) => {
      const orientation =
        Math.random() < 0.5 ? ORIENTATIONS.HORIZONTAL : ORIENTATIONS.VERTICAL;
      this.gameboard.placeShip(
        ship,
        this.#autoPlacementCoord(ship.length, orientation),
        orientation,
      );
      this.#blockPlacementZone(ship.position);
    });
  }

  // Automatically attack opponent's gameboard
  autoAttack(opponent) {
    const [row, col] =
      this.#autoAttackDirection(opponent) ||
      this.#autoAttackAdjacent(opponent) ||
      this.#autoAttackCoord(opponent);

    opponent.receiveAttack([row, col]);

    if (this.lastHit && opponent.hit.has(`${row},${col}`)) {
      this.nextHit = [row, col];
    } else if (opponent.hit.has(`${row},${col}`)) this.lastHit = [row, col];

    return [row, col];
  }

  // Creates random coordinates to be used for placing ships
  #autoPlacementCoord(length, orientation) {
    const rowSize = 10 - (orientation === ORIENTATIONS.VERTICAL ? length : 0);
    const colSize = 10 - (orientation === ORIENTATIONS.HORIZONTAL ? length : 0);

    const row = Math.floor(Math.random() * rowSize);
    const col = Math.floor(Math.random() * colSize);

    for (let i = 0; i < length; i += 1) {
      if (
        this.restrictedCells.has(
          `${row + (orientation === ORIENTATIONS.VERTICAL ? i : 0)}, ${col + (orientation === ORIENTATIONS.HORIZONTAL ? i : 0)}`,
        )
      )
        return this.#autoPlacementCoord(length, orientation);
    }

    return [row, col];
  }

  // Marks ship and surrounding cells as invalid for auto-placement
  #blockPlacementZone(position) {
    position.forEach(([row, col]) => {
      this.restrictedCells.add(`${row}, ${col}`);

      for (let i = 0; i < SHIP_OFFSETS.length; i += 1) {
        const newRow = row + SHIP_OFFSETS[i][0];
        const newCol = col + SHIP_OFFSETS[i][1];

        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
          this.restrictedCells.add(`${newRow}, ${newCol}`);
        }
      }
    });
  }

  // Generates a random coord for auto-attack
  #autoAttackCoord(opponent) {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);

    if (opponent.hit.has(`${row},${col}`) || opponent.miss.has(`${row},${col}`))
      this.#autoAttackCoord(opponent);

    return [row, col];
  }

  // Generates adjacent cell coord when last attack is a hit
  #autoAttackAdjacent(opponent) {
    if (!this.lastHit) return null;

    const [row, col] = this.lastHit;

    if (
      (row + 1 === opponent.board.length ||
        opponent.hit.has(`${row + 1},${col}`) ||
        opponent.miss.has(`${row + 1},${col}`)) &&
      (row - 1 < 0 ||
        opponent.hit.has(`${row - 1},${col}`) ||
        opponent.miss.has(`${row - 1},${col}`)) &&
      (col + 1 === opponent.board.length ||
        opponent.hit.has(`${row},${col + 1}`) ||
        opponent.miss.has(`${row},${col + 1}`)) &&
      (col - 1 < 0 ||
        opponent.hit.has(`${row},${col - 1}`) ||
        opponent.miss.has(`${row},${col - 1}`))
    )
      return null;

    const direction = Math.random() < 0.5 ? 'row' : 'col';
    const value = Math.random() < 0.5 ? +1 : -1;
    const newRow = direction === 'row' ? row + value : row;
    const newCol = direction === 'col' ? col + value : col;

    if (
      newRow === opponent.board.length ||
      newRow < 0 ||
      newCol === opponent.board.length ||
      newCol < 0 ||
      opponent.hit.has(`${newRow},${newCol}`) ||
      opponent.miss.has(`${newRow},${newCol}`)
    )
      return this.#autoAttackAdjacent(opponent);

    return [newRow, newCol];
  }

  // Continues directionality of consecutive successful hits
  #autoAttackDirection(opponent) {
    if (!this.nextHit) return null;

    const [row, col] = this.lastHit;
    const [nextRow, nextCol] = this.nextHit;

    const direction = row === nextRow ? 'row' : 'col';

    const nextTarget =
      direction === 'row'
        ? [row, nextCol > col ? nextCol + 1 : nextCol - 1]
        : [nextRow > row ? nextRow + 1 : nextRow - 1, col];

    return nextTarget;
  }
}

export default ComputerPlayer;
