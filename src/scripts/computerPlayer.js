import Player from './player';

class ComputerPlayer extends Player {
  constructor() {
    super();
    this.name = 'Computer';
  }

  autoPlaceShips() {}
}

export default ComputerPlayer;
