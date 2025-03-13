class Ship {
  constructor(length) {
    this.length = length;
    this.hitCount = 0;
    this.hasSunk = false;
  }

  // Calculates whether the ship should be considered sunk
  #isSunk() {
    if (this.length === this.hitCount) return true;
    return false;
  }

  // Increases hitCount
  hit() {
    if (this.hitCount === this.length) return (this.hasSunk = this.#isSunk());
    this.hitCount += 1;
  }

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
