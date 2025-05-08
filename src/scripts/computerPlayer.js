import Player from './player';
import { COMPUTER_PLAYER, ORIENTATIONS, SHIP_OFFSETS } from './constants';

class ComputerPlayer extends Player {
  constructor() {
    super();
    this.name = COMPUTER_PLAYER;
    this.restrictedCells = new Set();
    this.lastHit = null; // stores last successful hit
    this.nextHit = null; // stores successful hit adjacent to lastHit
    this.followingHits = []; // stores cells hit (after 1st and 2nd) until ship sinks
    this.directionHitCount = 0; // stores count until ship sinks or direction switches
    this.isSwitched = false; // true if lastHit and nextHit has already been switched
    this.targetQueue = []; // stores next target when ships detected are adjacent
  }

  // Automatically place all ships in the computer player's gameboard
  autoPlaceShips() {
    Object.values(this.gameboard.ships).forEach((ship) => {
      const orientation =
        Math.random() < 0.5 ? ORIENTATIONS.HORIZONTAL : ORIENTATIONS.VERTICAL;
      this.gameboard.placeShip(
        ship,
        this.#autoPlacementCoord(ship.length, orientation),
        orientation,
      );
      this.#blockPlacementZone(ship.position);
    });
  }

  // Automatically attack opponent's gameboard
  autoAttack(opponent) {
    const [row, col] =
      this.#autoAttackDirection(opponent) ||
      this.#autoAttackAdjacent(opponent) ||
      this.#autoAttackCoord(opponent);

    opponent.receiveAttack([row, col]);

    if (opponent.hit.has(`${row},${col}`)) {
      if (this.lastHit && this.nextHit) {
        this.followingHits.push([row, col]);
        this.directionHitCount += 1;
      } else if (this.lastHit && !this.nextHit) this.nextHit = [row, col];
      else this.lastHit = [row, col];
    }

    if (opponent.board[row][col]?.hasSunk) {
      this.#queueDeferredHits(opponent);
      this.#resetTargeting();
      if (this.targetQueue.length) {
        this.#cleanTargetQueue(opponent);
        this.lastHit = this.targetQueue.shift();
      }
    }

    return [row, col];
  }

  // Creates random coordinates to be used for placing ships
  #autoPlacementCoord(length, orientation) {
    const rowSize = 10 - (orientation === ORIENTATIONS.VERTICAL ? length : 0);
    const colSize = 10 - (orientation === ORIENTATIONS.HORIZONTAL ? length : 0);

    const row = Math.floor(Math.random() * rowSize);
    const col = Math.floor(Math.random() * colSize);

    for (let i = 0; i < length; i += 1) {
      if (
        this.restrictedCells.has(
          `${row + (orientation === ORIENTATIONS.VERTICAL ? i : 0)},${col + (orientation === ORIENTATIONS.HORIZONTAL ? i : 0)}`,
        )
      )
        return this.#autoPlacementCoord(length, orientation);
    }

    return [row, col];
  }

  // Marks ship and surrounding cells as invalid for auto-placement
  #blockPlacementZone(position) {
    position.forEach(([row, col]) => {
      this.restrictedCells.add(`${row},${col}`);

      for (let i = 0; i < SHIP_OFFSETS.length; i += 1) {
        const newRow = row + SHIP_OFFSETS[i][0];
        const newCol = col + SHIP_OFFSETS[i][1];

        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
          this.restrictedCells.add(`${newRow},${newCol}`);
        }
      }
    });
  }

  // Generates a random coord for auto-attack
  #autoAttackCoord(opponent) {
    for (let attempts = 0; attempts <= 100; attempts += 1) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);

      const coord = `${row},${col}`;
      const invalid = opponent.hit.has(coord) || opponent.miss.has(coord);
      const unlikely = this.#isUnlikelyShipCell(row, col, opponent);

      if (!invalid && !unlikely) return [row, col];
    }

    return this.#generateFallbackCoord(opponent);
  }

  // Generates adjacent cell coord when last attack is a hit
  #autoAttackAdjacent(opponent) {
    if (!this.lastHit) return null;

    const [row, col] = this.lastHit;

    if (
      (row + 1 === opponent.board.length ||
        opponent.hit.has(`${row + 1},${col}`) ||
        opponent.miss.has(`${row + 1},${col}`)) &&
      (row - 1 < 0 ||
        opponent.hit.has(`${row - 1},${col}`) ||
        opponent.miss.has(`${row - 1},${col}`)) &&
      (col + 1 === opponent.board[0].length ||
        opponent.hit.has(`${row},${col + 1}`) ||
        opponent.miss.has(`${row},${col + 1}`)) &&
      (col - 1 < 0 ||
        opponent.hit.has(`${row},${col - 1}`) ||
        opponent.miss.has(`${row},${col - 1}`))
    )
      return null;

    const direction = Math.random() < 0.5 ? 'row' : 'col';
    const value = Math.random() < 0.5 ? +1 : -1;
    const newRow = direction === 'row' ? row + value : row;
    const newCol = direction === 'col' ? col + value : col;

    if (
      newRow === opponent.board.length ||
      newRow < 0 ||
      newCol === opponent.board[0].length ||
      newCol < 0 ||
      opponent.hit.has(`${newRow},${newCol}`) ||
      opponent.miss.has(`${newRow},${newCol}`) ||
      this.#isUnlikelyShipCell(row, col, opponent, true)
    )
      return this.#autoAttackAdjacent(opponent);

    return [newRow, newCol];
  }

  // Continues directionality of consecutive successful hits
  #autoAttackDirection(opponent) {
    if (!this.nextHit) return null;

    const [row, col] = this.lastHit;
    const [nextRow, nextCol] = this.nextHit;

    const direction = row === nextRow ? 'row' : 'col';

    const nextTarget =
      direction === 'row'
        ? [
            row,
            nextCol > col
              ? nextCol + (1 + this.directionHitCount)
              : nextCol - (1 + this.directionHitCount),
          ]
        : [
            nextRow > row
              ? nextRow + (1 + this.directionHitCount)
              : nextRow - (1 + this.directionHitCount),
            col,
          ];

    if (
      opponent.hit.has(`${nextTarget[0]},${nextTarget[1]}`) &&
      !opponent.board[nextTarget[0]][nextTarget[1]]?.hasSunk
    ) {
      this.directionHitCount += 1;
      return this.#autoAttackDirection(opponent);
    }

    if (
      nextTarget[0] < 0 ||
      nextTarget[0] === opponent.board.length ||
      nextTarget[1] < 0 ||
      nextTarget[1] === opponent.board[0].length ||
      opponent.miss.has(`${nextTarget[0]},${nextTarget[1]}`) ||
      (opponent.hit.has(`${nextTarget[0]},${nextTarget[1]}`) &&
        opponent.board[nextTarget[0]][nextTarget[1]]?.hasSunk)
    ) {
      this.directionHitCount = 0;
      if (this.isSwitched) {
        this.#queueAdjacentShips();
        return null;
      }

      [this.lastHit, this.nextHit] = [this.nextHit, this.lastHit];
      this.isSwitched = true;
      return this.#autoAttackDirection(opponent);
    }

    return nextTarget;
  }

  // Fallback when random coord generation fails to provide a valid coord
  #generateFallbackCoord(opponent) {
    let validCoord; // stores last valid cell found even if it's unlikely

    for (let row = 0; row < opponent.board.length; row += 1) {
      for (let col = 0; col < opponent.board[0].length; col += 1) {
        if (
          !opponent.board[row][col]?.hasSunk &&
          !opponent.miss.has(`${row},${col}`) &&
          !this.#isUnlikelyShipCell(row, col, opponent)
        )
          return [row, col];
        if (
          !opponent.board[row][col]?.hasSunk &&
          !opponent.miss.has(`${row},${col}`)
        )
          validCoord = [row, col];
      }
    }

    return validCoord;
  }

  // Add hit cells that are part of different ships to be targeted next
  #queueAdjacentShips() {
    this.isSwitched = false;
    this.targetQueue.push(this.lastHit);
    this.followingHits.forEach((cell) => this.targetQueue.push(cell));

    this.lastHit = this.nextHit;
    this.nextHit = null;
    this.followingHits = [];
  }

  // When 2 adjacent ships are hit while trying to sink one, queue the other one
  #queueDeferredHits(opponent) {
    const deferredHits = [];

    deferredHits.push(this.lastHit, this.nextHit, ...this.followingHits);

    deferredHits.forEach(([row, col]) => {
      if (!opponent.board[row][col]?.hasSunk) this.targetQueue.push([row, col]);
    });
  }

  // Checks if a target cell can still contain the shortest remaining ship
  // eslint-disable-next-line class-methods-use-this
  #isUnlikelyShipCell(row, col, opponent, isAdjacent = false) {
    const shortestLength = Math.min(
      ...Object.values(opponent.ships)
        .filter((ship) => !ship.hasSunk)
        .map((ship) => ship.length),
    );

    const isEarlyGame = isAdjacent
      ? false
      : opponent.board.flat().filter((cell) => !cell).length > 30;

    let availableRow = isEarlyGame ? 0 : 1;
    let availableCol = isEarlyGame ? 0 : 1;

    let isLeftBlocked = false;
    let isRightBlocked = false;
    let isUpBlocked = false;
    let isDownBlocked = false;

    for (let i = 1; i !== shortestLength; i += 1) {
      if (!isRightBlocked) {
        if (
          col + i < opponent.board[0].length &&
          !opponent.miss.has(`${row},${col + i}`) &&
          !opponent.board[row][col + i]?.hasSunk
        )
          availableRow += 1;
        else isRightBlocked = true;
      }

      if (!isLeftBlocked) {
        if (
          col - i >= 0 &&
          !opponent.miss.has(`${row},${col - i}`) &&
          !opponent.board[row][col - i]?.hasSunk
        )
          availableRow += 1;
        else isLeftBlocked = true;
      }

      if (!isUpBlocked) {
        if (
          row + i < opponent.board.length &&
          !opponent.miss.has(`${row + i},${col}`) &&
          !opponent.board[row + i][col]?.hasSunk
        )
          availableCol += 1;
        else isUpBlocked = true;
      }

      if (!isDownBlocked) {
        if (
          row - i >= 0 &&
          !opponent.miss.has(`${row - i},${col}`) &&
          !opponent.board[row - i][col]?.hasSunk
        )
          availableCol += 1;
        else isDownBlocked = true;
      }

      if (
        (isLeftBlocked && isRightBlocked && isUpBlocked && isDownBlocked) ||
        availableRow >= shortestLength ||
        availableCol >= shortestLength
      )
        break;
    }

    return availableRow < shortestLength && availableCol < shortestLength;
  }

  // Removes targetQueue entries that are part of sunken ships
  #cleanTargetQueue(opponent) {
    this.targetQueue = this.targetQueue.filter(
      ([row, col]) => !opponent.board[row][col]?.hasSunk,
    );
  }

  #resetTargeting() {
    this.lastHit = null;
    this.nextHit = null;
    this.followingHits = [];
    this.isSwitched = false;
    this.directionHitCount = 0;
  }
}

export default ComputerPlayer;
