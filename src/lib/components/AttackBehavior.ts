import { Behavior, Direction } from './Behavior'

export class AttackBehavior implements Behavior {
  isActive: boolean = false
  direction: Direction | null = null
  ignoreTileCollision = true
  constructor() {}

  public getAnimBasedOnDirection(direction: Direction, animations: any, isAttacking?: boolean) {
    switch (direction) {
      case Direction.UP: {
        return isAttacking ? animations.attackBack : animations.moveBack
      }
      case Direction.DOWN: {
        return isAttacking ? animations.attackFront : animations.moveFront
      }
      case Direction.RIGHT:
      case Direction.LEFT: {
        return isAttacking ? animations.attackSide : animations.moveSide
      }
      default:
        return animations.idleFront
    }
  }

  handleTileCollision(obj1: any, obj2: any, animations: any) {}

  update(): void {}
  stop(): void {}
  start(): void {}
  destroy(): void {}
}
