import Ship from '../scripts/ship';

describe('Ship class methods', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test('adds hit count', () => {
    ship.hit();
    expect(ship.hitCount).toBe(1);
  });

  test('prevents exceeding length of ship', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.hitCount).not.toBeGreaterThan(ship.length);
  });

  test('verifies if ship is sunk', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.hasSunk).toBeTruthy();
  });

  test('returns Ship object correctly', () => {
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.getShip()).toEqual({
      length: 3,
      hitCount: 3,
      hasSunk: true,
    });
  });
});
