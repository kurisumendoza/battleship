import Ship from './ship';

const initializeShips = () => ({
  carrier: new Ship(5),
  battleship: new Ship(4),
  cruiser: new Ship(3),
  submarine: new Ship(3),
  destroyer: new Ship(2),
});

export default initializeShips;
