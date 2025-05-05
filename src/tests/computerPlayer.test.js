import ComputerPlayer from '../scripts/computerPlayer';
import Player from '../scripts/player';
import { ORIENTATIONS, SHIP_OFFSETS } from '../scripts/constants';

let computer;
let opponent;

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

describe('Automatically Launch Attack', () => {
  beforeEach(() => {
    computer = new ComputerPlayer();
    opponent = new Player();
  });

  test('Verifies successful attack launch', () => {
    computer.autoAttack(opponent.gameboard);

    const attackLanded = opponent.gameboard.board.some((row) =>
      row.some((col) => col !== null),
    );

    expect(attackLanded).toBe(true);
  });

  test('Targets adjacent cell when last attack result is a hit', () => {
    computer.lastHit = [1, 1]; // Property that stores last successful hit

    const nextAttack = computer.autoAttack(opponent.gameboard);

    const isAdjacent = (attack1, attack2) => {
      const [x1, y1] = attack1;
      const [x2, y2] = attack2;

      return (
        (x1 === x2 && Math.abs(y1 - y2) === 1) ||
        (y1 === y2 && Math.abs(x1 - x2) === 1)
      );
    };

    expect(isAdjacent(computer.lastHit, nextAttack)).toBe(true);
  });

  test('Continues attacking in the same direction after successful hit', () => {});
});
