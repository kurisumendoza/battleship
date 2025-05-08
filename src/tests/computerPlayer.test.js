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
    computer.lastHit = [1, 1]; // Simulate a previous successful hit at [1, 1]

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

  test('Continues attacking in the same direction after successful hit', () => {
    computer.lastHit = [2, 1];
    computer.nextHit = [1, 1];

    const thirdAttack = computer.autoAttack(opponent.gameboard);

    expect(thirdAttack).toEqual([0, 1]);
  });

  test('Attacks on the other direction when the next cell has already been hit', () => {
    computer.lastHit = [2, 2];
    computer.nextHit = [2, 3];
    opponent.gameboard.miss.add('2,4');

    const fourthAttack = computer.autoAttack(opponent.gameboard);

    expect(fourthAttack).toEqual([2, 1]);
  });

  // Very small chance to still fail, [1, 4] can still be the randomly generated coord
  test('Stops continuing in the same direction after sinking a ship', () => {
    opponent.gameboard.placeShip(
      opponent.gameboard.ships.cruiser,
      [1, 1],
      ORIENTATIONS.HORIZONTAL,
    );

    opponent.gameboard.receiveAttack([1, 1]);
    opponent.gameboard.receiveAttack([1, 2]);

    computer.lastHit = [1, 1];
    computer.nextHit = [1, 2];

    computer.autoAttack(opponent.gameboard);

    const nextAttack = computer.autoAttack(opponent.gameboard);

    expect(nextAttack).not.toEqual([1, 4]);
  });

  test('Treats hits as separate ships after failing to confirm direction', () => {
    opponent.gameboard.placeShip(
      opponent.gameboard.ships.cruiser,
      [1, 1],
      ORIENTATIONS.HORIZONTAL,
    );
    opponent.gameboard.placeShip(
      opponent.gameboard.ships.submarine,
      [2, 1],
      ORIENTATIONS.HORIZONTAL,
    );
    opponent.gameboard.placeShip(
      opponent.gameboard.ships.battleship,
      [3, 1],
      ORIENTATIONS.HORIZONTAL,
    );

    opponent.gameboard.receiveAttack([1, 2]);
    opponent.gameboard.receiveAttack([2, 2]);

    computer.lastHit = [1, 2];
    computer.nextHit = [2, 2];

    computer.autoAttack(opponent.gameboard);
    computer.autoAttack(opponent.gameboard);
    computer.autoAttack(opponent.gameboard);

    const newAttack = computer.autoAttack(opponent.gameboard);

    const isCorrectTarget =
      newAttack[0] === 1 && (newAttack[1] === 1 || newAttack[1] === 3);

    expect(isCorrectTarget).toBe(true);
  });

  test('Queues a newly discovered/hit ship while sinking another ship', () => {
    opponent.gameboard.placeShip(
      opponent.gameboard.ships.battleship,
      [0, 1],
      ORIENTATIONS.HORIZONTAL,
    );
    opponent.gameboard.placeShip(
      opponent.gameboard.ships.submarine,
      [0, 5],
      ORIENTATIONS.VERTICAL,
    );
    opponent.gameboard.placeShip(
      opponent.gameboard.ships.destroyer,
      [0, 6],
      ORIENTATIONS.HORIZONTAL,
    );

    opponent.gameboard.receiveAttack([0, 6]);
    opponent.gameboard.receiveAttack([0, 5]);

    computer.lastHit = [0, 6];
    computer.nextHit = [0, 5];

    computer.autoAttack(opponent.gameboard);
    computer.autoAttack(opponent.gameboard);
    computer.autoAttack(opponent.gameboard);
    computer.autoAttack(opponent.gameboard);

    expect(computer.lastHit).toEqual([0, 6]);
    expect(computer.targetQueue.at(-1)).toEqual([0, 5]);
  });

  // Very small chance to still pass when incorrectly implemented due to randomness
  test('Skips attacking cells that is impossible to contain a ship', () => {
    // [0, 0] can't contain any ship and should not be attacked
    opponent.gameboard.receiveAttack([0, 1]);
    opponent.gameboard.receiveAttack([1, 0]);

    // Destroyer sunk, so only 3 or more empty cells in one direction is valid
    opponent.gameboard.placeShip(
      opponent.gameboard.ships.destroyer,
      [9, 0],
      ORIENTATIONS.HORIZONTAL,
    );
    opponent.gameboard.receiveAttack([9, 0]);
    opponent.gameboard.receiveAttack([9, 1]);

    // [0, 9], [1, 9] should not be attacked as the shortest ship is 3 cells long
    opponent.gameboard.receiveAttack([0, 8]);
    opponent.gameboard.receiveAttack([1, 8]);
    opponent.gameboard.receiveAttack([2, 9]);

    for (let i = 0; i < 70; i += 1) {
      computer.autoAttack(opponent.gameboard);
    }

    expect(opponent.gameboard.board[0][0]).toBeNull();
    expect(opponent.gameboard.board[0][9]).toBeNull();
    expect(opponent.gameboard.board[1][9]).toBeNull();
  });
});
