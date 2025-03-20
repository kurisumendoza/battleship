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
});
