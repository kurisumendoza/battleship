import ComputerPlayer from '../scripts/computerPlayer';
import { SHIP_OFFSETS } from '../scripts/constants';

let computer;

describe('Automatic Ship Placement', () => {
  beforeEach(() => {
    computer = new ComputerPlayer();
  });

  test('Check if all ships are automatically placed', () => {
    computer.autoPlaceShips();

    expect(computer.gameboard.isAllPlaced()).toBe(true);
  });

  test('Ensure that each ship is at least one cell apart', () => {
    computer.autoPlaceShips();

    const validPlacement = Object.values(computer.gameboard.ships).every(
      (ship) => {
        return ship.position.every(([x, y]) => {
          for (let i = 0; i < SHIP_OFFSETS.length; i += 1) {
            const newX = SHIP_OFFSETS[i][0] + x;
            const newY = SHIP_OFFSETS[i][1] + y;

            if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
              const isNull = computer.gameboard.board[newX][newY] === null;
              const isPartOfShip = ship.position.some(
                ([posX, posY]) => posX === newX && posY === newY,
              );

              if (!isNull && !isPartOfShip) return false;
            }
          }
          return true;
        });
      },
    );

    expect(validPlacement).toBe(true);
  });
});
