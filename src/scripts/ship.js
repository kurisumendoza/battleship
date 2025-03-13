class Ship {
  constructor(length, isSunk = false) {
    this.length = length;
    this.hitCount = 0;
    this.isSunk = isSunk;
  }

  // Increases hitCount
  hit() {
    if (this.hitCount === this.length) return;
    this.hitCount += 1;
  }

  // Calculates whether the ship should be considered sunk
  isSunk() {}

  // Returns an object with the ship's status
  getShip() {
    return {
      length: this.length,
      hitCount: this.hitCount,
      isSunk: this.isSunk,
    };
  }
}

export default Ship;
