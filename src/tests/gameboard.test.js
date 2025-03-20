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
