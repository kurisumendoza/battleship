import Ship from '../scripts/ship';

const ship = new Ship(3);

describe('Ship class methods', () => {
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
    expect(ship.hasSunk).toBeTruthy();
  });

  test('return Ship object correctly', () => {
    expect(ship.getShip()).toEqual({
      length: 3,
      hitCount: 3,
      hasSunk: true,
    });
  });
});
