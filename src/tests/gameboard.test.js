import Gameboard from '../scripts/gameboard';

const gameboard = new Gameboard();

test('Check if board is initialized correctly', () => {
  const isValidBoard = (board) => {
    if (board.length !== 10) return false;
    return board.every(
      (row) => row.length === 10 && row.every((tile) => tile === null),
    );
  };

  expect(isValidBoard(gameboard.board)).toBe(true);
});

describe('Verify ship placements', () => {
  test('Check if properly placed horizontally', () => {
    gameboard.placeShip(gameboard.ships.carrier, [9, 5], 'horizontal');

    const tilesFilled = [5, 6, 7, 8, 9].every(
      (tile) => gameboard.board[9][tile] === gameboard.ships.carrier,
    );

    expect(tilesFilled).toBe(true);
  });

  test('Check if properly placed vertically', () => {
    gameboard.placeShip(gameboard.ships.cruiser, [0, 1], 'vertical');

    const tilesFilled = [0, 1, 2].every(
      (tile) => gameboard.board[tile][1] === gameboard.ships.cruiser,
    );

    expect(tilesFilled).toBe(true);
  });

  test('Will not work when out of bounds', () => {
    expect(() =>
      gameboard.placeShip(gameboard.ships.battleship, [0, 9], 'horizontal'),
    ).toThrow(new Error('Out of bounds'));
  });
});

describe('Gameboard attack handling', () => {
  test('Marks a missed shot on the board', () => {
    gameboard.receiveAttack([5, 2]);
    expect(gameboard.board[5][2]).toBe('miss');
  });

  test('Stores coordinates of successful hits', () => {
    gameboard.receiveAttack([9, 5]);
    expect(gameboard.hit.some(([row, col]) => row === 9 && col === 5)).toBe(
      true,
    );
  });

  test('Marks ship as sunk when all its tiles are hit', () => {
    gameboard.placeShip(gameboard.ships.destroyer, [0, 8], 'horizontal');
    gameboard.receiveAttack([0, 8]);
    gameboard.receiveAttack([0, 9]);
    expect(gameboard.ships.destroyer.hasSunk).toBe(true);
  });
});
