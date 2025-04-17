import Ship from './ship';

const initializeShips = () => ({
  carrier: new Ship('carrier', 5),
  battleship: new Ship('battleship', 4),
  cruiser: new Ship('cruiser', 3),
  submarine: new Ship('submarine', 3),
  destroyer: new Ship('destroyer', 2),
});

export default initializeShips;
