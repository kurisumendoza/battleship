import ComputerPlayer from '../scripts/computerPlayer';

let computer;

describe('Automatic Ship Placement', () => {
  beforeEach(() => {
    computer = new ComputerPlayer();
  });

  test('Check if all ships are automatically placed', () => {
    computer.autoPlaceShips();

    expect(computer.gameboard.isAllPlaced()).toBe(true);
  });
});
