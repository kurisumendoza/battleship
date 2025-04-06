import Gameboard from '../scripts/gameboard';

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
    gameboard.placeShip(gameboard.ships.carrier, [9, 5], 'horizontal');

    const cellsFilled = [5, 6, 7, 8, 9].every(
      (cell) => gameboard.board[9][cell] === gameboard.ships.carrier,
    );

    expect(cellsFilled).toBe(true);
  });

  test('Check if properly placed vertically', () => {
    gameboard.placeShip(gameboard.ships.cruiser, [0, 1], 'vertical');

    const cellsFilled = [0, 1, 2].every(
      (cell) => gameboard.board[cell][1] === gameboard.ships.cruiser,
    );

    expect(cellsFilled).toBe(true);
  });

  test('Will not work when out of bounds', () => {
    expect(() =>
      gameboard.placeShip(gameboard.ships.battleship, [0, 9], 'horizontal'),
    ).toThrow(new Error('Invalid placement: Out of bounds'));
  });

  test('Will not work when new ship overlaps another ship', () => {
    gameboard.placeShip(gameboard.ships.submarine, [0, 1], 'vertical');
    expect(() => {
      gameboard.placeShip(gameboard.ships.destroyer, [0, 0], 'horizontal');
    }).toThrow(new Error('Invalid placement: Overlaps existing ship'));
  });
});

describe('Gameboard attack handling', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Marks a missed shot on the board', () => {
    gameboard.receiveAttack([5, 2]);
    expect(gameboard.board[5][2]).toBe('miss');
  });

  test('Stores coordinates of successful hits', () => {
    gameboard.placeShip(gameboard.ships.submarine, [9, 5], 'horizontal');
    gameboard.receiveAttack([9, 5]);
    expect(gameboard.hit.has(`${9},${5}`)).toBe(true);
  });

  test('Marks ship as sunk when all its cells are hit', () => {
    gameboard.placeShip(gameboard.ships.destroyer, [0, 8], 'horizontal');
    gameboard.receiveAttack([0, 8]);
    gameboard.receiveAttack([0, 9]);
    expect(gameboard.ships.destroyer.hasSunk).toBe(true);
  });

  test('Prevents hitting a cell that has already been hit', () => {
    gameboard.receiveAttack([5, 5]);
    expect(() => gameboard.receiveAttack([5, 5])).toThrow(
      new Error('Cell has already been hit'),
    );
  });
});

describe('Sunk ships tracking', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('Returns false when not all ships are sunk', () => {
    gameboard.placeShip(gameboard.ships.destroyer, [0, 0], 'horizontal');
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([0, 1]);

    expect(gameboard.isAllSunk()).toBe(false);
  });

  test('Returns true when all ships are sunk', () => {
    Object.values(gameboard.ships).forEach((ship, row) => {
      gameboard.placeShip(ship, [row, 0], 'horizontal');
      for (let i = 0; i < ship.length; i += 1)
        gameboard.receiveAttack([row, i]);
    });

    expect(gameboard.isAllSunk()).toBe(true);
  });
});
