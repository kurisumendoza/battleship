import Ship from '../scripts/ship';

const ship = new Ship(3);

test('add hit count', () => {
  ship.hit();
  expect(ship.hitCount).toBe(1);
});
