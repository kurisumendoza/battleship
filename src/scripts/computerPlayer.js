import Player from './player';

class ComputerPlayer extends Player {
  constructor() {
    super();
    this.name = 'Computer';
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
        this.gameboard.occupied.has(
          `${row + (orientation === 'vertical' ? i : 0)}, ${col + (orientation === 'horizontal' ? i : 0)}`,
        )
      )
        return this.#autoPlacementCoord(length, orientation);
    }

    return [row, col];
  }
}

export default ComputerPlayer;
