import Gameboard from '../scripts/gameboard';
import { CELL_STATES, ORIENTATIONS } from '../scripts/constants';

let gameboard;

describe('Board initialization', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Check if board is initialized correctly', () => {
    const isValidBoard = (board) => {
      if (board.length !== 10) return false;
      return board.every(
        (row) => row.length === 10 && row.every((cell) => cell === null),
      );
    };

    expect(isValidBoard(gameboard.board)).toBe(true);
  });
});

describe('Verify ship placements', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Check if properly placed horizontally', () => {
    gameboard.placeShip(
      gameboard.ships.carrier,
      [9, 5],
      ORIENTATIONS.HORIZONTAL,
    );

    const cellsFilled = [5, 6, 7, 8, 9].every(
      (cell) => gameboard.board[9][cell] === gameboard.ships.carrier,
    );

    expect(cellsFilled).toBe(true);
  });

  test('Check if properly placed vertically', () => {
    gameboard.placeShip(gameboard.ships.cruiser, [0, 1], ORIENTATIONS.VERTICAL);

    const cellsFilled = [0, 1, 2].every(
      (cell) => gameboard.board[cell][1] === gameboard.ships.cruiser,
    );

    expect(cellsFilled).toBe(true);
  });

  test('Will not work when out of bounds', () => {
    const result = gameboard.placeShip(
      gameboard.ships.battleship,
      [0, 9],
      ORIENTATIONS.HORIZONTAL,
    );
    expect(result).toEqual({
      success: false,
      message: 'Out of bounds',
    });
  });

  test('Will not work when new ship overlaps another ship', () => {
    gameboard.placeShip(
      gameboard.ships.submarine,
      [0, 1],
      ORIENTATIONS.VERTICAL,
    );
    const result = gameboard.placeShip(
      gameboard.ships.destroyer,
      [0, 0],
      ORIENTATIONS.HORIZONTAL,
    );
    expect(result).toEqual({
      success: false,
      message: 'Overlaps existing ship',
    });
  });
});

describe('Verify ship removal from board', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Check if ship is successfully removed from the board', () => {
    gameboard.placeShip(
      gameboard.ships.destroyer,
      [3, 0],
      ORIENTATIONS.HORIZONTAL,
    );

    gameboard.removeShip(gameboard.ships.destroyer);

    const cellsCleared = [0, 1].every(
      (cell) => gameboard.board[3][cell] === null,
    );

    expect(cellsCleared).toBe(true);
  });
});

describe('Gameboard attack handling', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Marks a missed shot on the board', () => {
    gameboard.receiveAttack([5, 2]);
    expect(gameboard.board[5][2]).toBe(CELL_STATES.MISS);
  });

  test('Stores coordinates of successful hits', () => {
    gameboard.placeShip(
      gameboard.ships.submarine,
      [9, 5],
      ORIENTATIONS.HORIZONTAL,
    );
    gameboard.receiveAttack([9, 5]);
    expect(gameboard.hit.has(`${9},${5}`)).toBe(true);
  });

  test('Marks ship as sunk when all its cells are hit', () => {
    gameboard.placeShip(
      gameboard.ships.destroyer,
      [0, 8],
      ORIENTATIONS.HORIZONTAL,
    );
    gameboard.receiveAttack([0, 8]);
    gameboard.receiveAttack([0, 9]);
    expect(gameboard.ships.destroyer.hasSunk).toBe(true);
  });

  test('Prevents hitting a cell that has already been hit', () => {
    gameboard.receiveAttack([5, 5]);
    const result = gameboard.receiveAttack([5, 5]);
    expect(result).toEqual({
      success: false,
      message: 'Cell has already been hit',
    });
  });
});

describe('Check ship placement completion', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Returns true if all ships are placed', () => {
    gameboard.placeShip(
      gameboard.ships.carrier,
      [0, 0],
      ORIENTATIONS.HORIZONTAL,
    );
    gameboard.placeShip(
      gameboard.ships.battleship,
      [1, 0],
      ORIENTATIONS.HORIZONTAL,
    );
    gameboard.placeShip(
      gameboard.ships.cruiser,
      [2, 0],
      ORIENTATIONS.HORIZONTAL,
    );
    gameboard.placeShip(
      gameboard.ships.submarine,
      [3, 0],
      ORIENTATIONS.HORIZONTAL,
    );
    gameboard.placeShip(
      gameboard.ships.destroyer,
      [4, 0],
      ORIENTATIONS.HORIZONTAL,
    );

    expect(gameboard.isAllPlaced()).toBe(true);
  });

  test('Returns false if not all ships are placed', () => {
    gameboard.placeShip(
      gameboard.ships.carrier,
      [0, 0],
      ORIENTATIONS.HORIZONTAL,
    );
    gameboard.placeShip(
      gameboard.ships.battleship,
      [1, 0],
      ORIENTATIONS.HORIZONTAL,
    );

    expect(gameboard.isAllPlaced()).toBe(false);
  });
});

describe('Sunk ships tracking', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Returns false when not all ships are sunk', () => {
    gameboard.placeShip(
      gameboard.ships.destroyer,
      [0, 0],
      ORIENTATIONS.HORIZONTAL,
    );
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 1]);

    expect(gameboard.isAllSunk()).toBe(false);
  });

  test('Returns true when all ships are sunk', () => {
    Object.values(gameboard.ships).forEach((ship, row) => {
      gameboard.placeShip(ship, [row, 0], ORIENTATIONS.HORIZONTAL);
      for (let i = 0; i < ship.length; i += 1)
        gameboard.receiveAttack([row, i]);
    });

    expect(gameboard.isAllSunk()).toBe(true);
  });
});
