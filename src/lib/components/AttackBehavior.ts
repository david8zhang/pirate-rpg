import { AnimationType } from '~/utils/Constants'
import { Behavior, Direction } from './Behavior'

export class AttackBehavior implements Behavior {
  name: string = 'ATTACK'
  isActive: boolean = false
  direction: Direction | null = null
  ignoreTileCollision = true
  constructor() {}

  public getAnimBasedOnDirection(direction: Direction, animations: any, isAttacking?: boolean) {
    switch (direction) {
      case Direction.UP: {
        return isAttacking
          ? animations[AnimationType.ATTACK_BACK]
          : animations[AnimationType.WALK_BACK]
      }
      case Direction.DOWN: {
        return isAttacking
          ? animations[AnimationType.ATTACK_FRONT]
          : animations[AnimationType.WALK_FRONT]
      }
      case Direction.RIGHT:
      case Direction.LEFT: {
        return isAttacking
          ? animations[AnimationType.ATTACK_SIDE]
          : animations[AnimationType.WALK_SIDE]
      }
      default:
        return animations[AnimationType.IDLE_FRONT]
    }
  }

  handleTileCollision(obj1: any, obj2: any, animations: any) {}

  update(): void {}
  stop(): void {}
  start(): void {}
  destroy(): void {}
  disable(): void {}
}
