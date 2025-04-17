class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.hitCount = 0;
    this.hasSunk = false;
    this.position = [];
  }

  // Calculates whether the ship should be considered sunk
  #isSunk() {
    if (this.length === this.hitCount) return true;
    return false;
  }

  // Increases hitCount
  hit() {
    if (this.hasSunk) return;
    this.hitCount += 1;
    if (this.hitCount === this.length) this.hasSunk = this.#isSunk();
  }

  // Returns an object with the ship's status
  getShip() {
    return {
      length: this.length,
      hitCount: this.hitCount,
      hasSunk: this.hasSunk,
    };
  }
}

export default Ship;
