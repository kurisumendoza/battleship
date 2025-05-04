import Player from './player';
import { COMPUTER_PLAYER, ORIENTATIONS, SHIP_OFFSETS } from './constants';

class ComputerPlayer extends Player {
  constructor() {
    super();
    this.name = COMPUTER_PLAYER;
    this.restrictedCells = new Set();
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
    opponent.receiveAttack(this.#autoAttackCoord());
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
  #autoAttackCoord() {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);

    return [row, col];
  }
}

export default ComputerPlayer;
