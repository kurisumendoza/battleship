import Ship from '../scripts/ship';

const ship = new Ship(3);

describe('adding hit count to the ship', () => {
  test('add hit count', () => {
    ship.hit();
    expect(ship.hitCount).toBe(1);
  });

  test('should not exceed length of ship', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.hitCount).not.toBeGreaterThan(ship.length);
  });

  test('verify if ship is sunk', () => {
    expect(ship.isSunk).toBeTruthy();
  });
});
