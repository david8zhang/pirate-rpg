import { Mob } from '~/mobs/Mob'
import Game from '../../scenes/Game'
import { AttackBehavior } from './AttackBehavior'
import { Direction } from './MovementBehavior'

export class MeleeAttackBehavior extends AttackBehavior {
  private mob: Mob
  public isAttacking: boolean = false
  public isMoving: boolean = false

  constructor(mob: Mob) {
    super()
    this.mob = mob
  }

  setActive(isActive: boolean) {
    this.isActive = isActive
  }

  update() {
    // If the attack behavior is active, have the enemy follow the player
    if (this.isActive && this.mob.sprite) {
      const { animations } = this.mob
      const direction: Direction | null = this.getDirectionToMove()

      // If the direction is null, then do an attack
      if (direction === null) {
        if (!this.isAttacking) {
          this.isMoving = false
          this.isAttacking = true
          this.mob.sprite.anims.play(animations.attackFront)
        }

        // Else, have the mob move towards the player by moving in the direction
      } else {
        const moveAnim = this.getAnimBasedOnDirection(direction, animations)
        this.isAttacking = false
        if (this.mob.sprite.anims.getName() !== moveAnim) {
          this.mob.sprite.anims.play(moveAnim)
        }
        this.moveInDirection(direction)
      }
    }
  }

  moveInDirection(direction: Direction) {
    switch (direction) {
      case Direction.UP: {
        this.mob.sprite.setVelocity(0, -this.mob.moveBehavior.speed)
        break
      }
      case Direction.DOWN: {
        this.mob.sprite.setVelocity(0, this.mob.moveBehavior.speed)
        break
      }
      case Direction.LEFT: {
        this.mob.sprite.setVelocity(-this.mob.moveBehavior.speed, 0)
        break
      }
      case Direction.RIGHT: {
        this.mob.sprite.setVelocity(this.mob.moveBehavior.speed, 0)
        break
      }
    }
  }

  getDirectionToMove(): any {
    const gameScene = this.mob.scene as Game
    const player = gameScene.player
    const dx = Math.floor(this.mob.sprite.x - player.x)
    const dy = Math.floor(this.mob.sprite.y - player.y)

    // If the dx and dy are within the attack range, return null (which signals to attack)
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      return null
    }

    if (dx <= 1 && dx >= -1) {
      return dy > 0 ? Direction.UP : Direction.DOWN
    }

    if (dy <= 1 && dy >= -1) {
      return dx > 0 ? Direction.LEFT : Direction.RIGHT
    }

    // If the dx is less than dy, move along the y axis
    if (dx > dy || dx === 0) {
      // If dy > 0, then the current mob is below the player
      if (dy > 0) {
        return Direction.UP
      } else {
        return Direction.DOWN
      }
    } else if (dy > dx || dy === 0) {
      // If dx > 0, then the current mob is to the right of the player
      if (dx > 0) {
        return Direction.LEFT
      } else {
        return Direction.RIGHT
      }
    }
  }

  stop() {}

  start() {}

  destroy() {}
}
