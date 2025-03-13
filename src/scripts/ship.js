class Ship {
  constructor(length, hitCount = 0, isSunk = false) {
    this.length = length;
    this.hitCount = hitCount;
    this.isSunk = isSunk;
  }

  hit() {}

  getShip() {
    return {
      length: this.length,
      hitCount: this.hitCount,
      isSunk: this.isSunk,
    };
  }
}

export default Ship;
