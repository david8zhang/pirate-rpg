import { Behavior } from './Behavior'
import { Direction } from './MovementBehavior'

export class AttackBehavior implements Behavior {
  isActive: boolean = false
  constructor() {}

  public getAnimBasedOnDirection(direction, animations) {
    switch (direction) {
      case Direction.UP: {
        return animations.moveBack
      }
      case Direction.DOWN: {
        return animations.moveFront
      }
      case Direction.RIGHT:
      case Direction.LEFT: {
        return animations.moveSide
      }
      default:
        return animations.idleFront
    }
  }

  update(): void {}
  stop(): void {}
  start(): void {}
  destroy(): void {}
}
