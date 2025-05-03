import Player from './player';

class ComputerPlayer extends Player {
  constructor() {
    super();
    this.name = 'Computer';
    this.restrictedCells = new Set();
  }

  // Automatically place all ships in the computer player's gameboard
  autoPlaceShips() {
    Object.values(this.gameboard.ships).forEach((ship) => {
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      this.gameboard.placeShip(
        ship,
        this.#autoPlacementCoord(ship.length, orientation),
        orientation,
      );
      this.#blockPlacementZone(ship.position);
    });
  }

  // Creates random coordinates to be used for placing ships
  #autoPlacementCoord(length, orientation) {
    const rowSize = 10 - (orientation === 'vertical' ? length : 0);
    const colSize = 10 - (orientation === 'horizontal' ? length : 0);

    const row = Math.floor(Math.random() * rowSize);
    const col = Math.floor(Math.random() * colSize);

    for (let i = 0; i < length; i += 1) {
      if (
        this.restrictedCells.has(
          `${row + (orientation === 'vertical' ? i : 0)}, ${col + (orientation === 'horizontal' ? i : 0)}`,
        )
      )
        return this.#autoPlacementCoord(length, orientation);
    }

    return [row, col];
  }

  // Marks ship and surrounding cells as invalid for auto-placement
  #blockPlacementZone(position) {
    const offsets = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    position.forEach(([row, col]) => {
      this.restrictedCells.add(`${row}, ${col}`);

      for (let i = 0; i < offsets.length; i += 1) {
        const newRow = row + offsets[i][0];
        const newCol = col + offsets[i][1];

        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
          this.restrictedCells.add(`${newRow}, ${newCol}`);
        }
      }
    });
  }
}

const comp = new ComputerPlayer();
comp.autoPlaceShips();

export default ComputerPlayer;
