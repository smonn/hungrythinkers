class BaseState {
  constructor(philosopher) {
    this._philosopher = philosopher;
  }

  get type() {
    throw new Error('Not implemented');
  }

  tick() {
    throw new Error('Not implemented');
  }
}

export class ThinkState extends BaseState {
  constructor(philosopher) {
    super(philosopher);
  }

  get type() {
    return 'think';
  }

  tick() {
    this._philosopher.fillBowl();

    if (this._philosopher.hasChopsticks) {
      return new EatState(this._philosopher);
    }

    this._philosopher.requestChopsticks();
    return this;
  }
}

export class EatState extends BaseState {
  constructor(philosopher) {
    super(philosopher);
  }

  get type() {
    return 'eat';
  }

  tick() {
    this._philosopher.eat();

    if (this._philosopher.isBowlEmpty) {
      this._philosopher.releaseChopsticks();
      return new ThinkState(this._philosopher);
    }

    return this;
  }
}

export class Bowl {
  constructor(id, maxFillAmount) {
    this._id = id;
    this._fillAmount = 0;
    this._maxFillAmount = maxFillAmount;
  }

  get id() {
    return this._id;
  }

  get isEmpty() {
    return this._fillAmount === 0;
  }

  get fillLevel() {
    return this._fillAmount / this._maxFillAmount;
  }

  fill() {
    this._fillAmount = Math.min(this._fillAmount + 1, this._maxFillAmount);
  }

  scoop() {
    this._fillAmount = Math.max(this._fillAmount - 3, 0);
  }
}

export class Chopstick {
  constructor(id) {
    this._id = id;
    this._philosopher = null;
  }

  get id() {
    return this._id;
  }

  get philosopher() {
    return this._philosopher;
  }

  isHeldBy(philosopher) {
    return this._philosopher === philosopher;
  }

  pickup(philosopher) {
    if (!this._philosopher) {
      this._philosopher = philosopher;
    }
  }

  drop(philosopher) {
    if (this.isHeldBy(philosopher)) {
      this._philosopher = null;
    }
  }
}

export class Philosopher {
  constructor(id, leftChopstick, rightChopstick, bowl) {
    this._id = id;
    this._leftChopstick = leftChopstick;
    this._rightChopstick = rightChopstick;
    this._bowl = bowl;
    this._state = new ThinkState(this);
  }

  get id() {
    return this._id;
  }

  get hasChopsticks() {
    return this._leftChopstick.isHeldBy(this) && this._rightChopstick.isHeldBy(this);
  }

  get isBowlEmpty() {
    return this._bowl.isEmpty;
  }

  get state() {
    return this._state.type;
  }

  fillBowl() {
    this._bowl.fill();
  }

  eat() {
    this._bowl.scoop();
  }

  requestChopsticks() {
    this._leftChopstick.pickup(this);
    this._rightChopstick.pickup(this);
    if (!this.hasChopsticks) {
      this.releaseChopsticks();
    }
  }

  releaseChopsticks() {
    this._leftChopstick.drop(this);
    this._rightChopstick.drop(this);
  }

  tick() {
    this._state = this._state.tick();
  }
}

export class DiningPhilosophers {
  constructor(count) {
    this._count = count;
    this._chopsticks = Array(count).fill(null).map((x, i) => new Chopstick(i));
    this._bowls = Array(count).fill(null).map((x, i) => new Bowl(i, 10));
    this._philosophers = Array(count).fill(null).map((x, i) => {
      const leftChopstickIndex = i;
      let rightChopstickIndex = i + 1;
      if (rightChopstickIndex >= count) {
        rightChopstickIndex = 0;
      }
      return new Philosopher(i, this._chopsticks[leftChopstickIndex], this._chopsticks[rightChopstickIndex], this._bowls[i]);
    });
  }

  get chopsticks() {
    return this._chopsticks;
  }

  get bowls() {
    return this._bowls;
  }

  get philosophers() {
    return this._philosophers;
  }

  tick() {
    // not quite asynchronous as it's determined by the order they were created
    this._philosophers.forEach(philosopher => philosopher.tick());
    const clone = new DiningPhilosophers(this._count);
    clone._bowls = this._bowls;
    clone._chopsticks = this._chopsticks;
    clone._philosophers = this._philosophers;
    return clone;
  }
}
