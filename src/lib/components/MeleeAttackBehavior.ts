import { Mob } from '~/mobs/Mob'
import Game from '../../scenes/Game'
import { AttackBehavior } from './AttackBehavior'
import { Direction } from './Behavior'

enum AttackState {
  FOLLOW = 0,
  ATTACK = 1,
}

export class MeleeAttackBehavior extends AttackBehavior {
  private mob: Mob
  public state: AttackState = AttackState.FOLLOW
  public chaseSpeed = 50
  public attackRange = 20
  private attackDamage = 5

  private hitboxImage: Phaser.Physics.Arcade.Image
  private hitboxCollider: Phaser.Physics.Arcade.Collider
  public name: string = 'MELEE_ATTACK'

  constructor(mob: Mob) {
    super()
    this.mob = mob
    this.hitboxImage = this.mob.scene.physics.add.image(this.mob.sprite.x, this.mob.sprite.y, '')
    this.hitboxImage.setVisible(false)
    this.mob.scene.physics.world.enableBody(this.hitboxImage, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.hitboxImage.setPushable(false)
    this.hitboxImage.setDebugBodyColor(0xffff00)

    const { attackConfig } = this.mob.mobConfig
    if (attackConfig) {
      this.chaseSpeed = attackConfig.chaseSpeed
      this.attackRange = attackConfig.attackRange
      this.attackDamage = attackConfig.attackDamage
    }

    const gameScene = this.mob.scene as Game
    this.hitboxCollider = this.mob.scene.physics.add.overlap(
      this.hitboxImage,
      gameScene.player,
      this.attackPlayer,
      undefined,
      this
    )
    this.hitboxCollider.active = false
  }

  attackPlayer() {
    const gameScene = this.mob.scene as Game
    if (
      !gameScene.player.isDead &&
      !gameScene.player.isHit &&
      gameScene.player.getCurrState() !== 'attack' &&
      !this.mob.isHit
    ) {
      gameScene.player.takeDamage(this.attackDamage)
      gameScene.player.isHit = true
      this.mob.scene.cameras.main.shake(150, 0.002)
      this.mob.scene.time.delayedCall(gameScene.player.iFrameDuration, () => {
        gameScene.player.isHit = false
      })
    }
  }

  disable() {
    this.hitboxCollider.active = false
  }

  update() {
    // If the attack behavior is active, have the enemy follow the player
    if (this.isActive) {
      const { animations } = this.mob
      const direction: Direction = this.getDirectionToMove()
      this.direction = direction

      // If the direction is null, then do an attack
      if (this.isPlayerInAttackRange() && Game.instance.player.active) {
        this.startAttackAnimation()
        // Else, have the mob move towards the player by moving in the direction
      } else {
        const moveAnim = this.getAnimBasedOnDirection(direction, animations)
        this.state = AttackState.FOLLOW
        this.hitboxCollider.active = false
        if (this.mob.sprite.anims.getName() !== moveAnim) {
          this.mob.sprite.anims.play(moveAnim)
        }
        this.moveInDirection(direction)
      }
    }
  }

  startAttackAnimation() {
    const { animations } = this.mob
    const direction: Direction = this.getDirectionToMove()
    this.mob.sprite.setVelocity(0)
    if (this.state !== AttackState.ATTACK) {
      this.state = AttackState.ATTACK
      this.activateHitbox(direction)
    }
    const attackAnim = this.getAnimBasedOnDirection(direction, animations, true)
    if (this.mob.sprite.anims.getName() !== attackAnim) {
      this.mob.sprite.anims.play(attackAnim)
    }
  }

  activateHitbox(direction: Direction) {
    const { attackConfig, body } = this.mob.mobConfig
    this.hitboxImage.setPosition(this.mob.sprite.x, this.mob.sprite.y)
    if (body && body.offsetY) {
      this.hitboxImage.body.offset.y = 0
    }
    if (body && body.offsetX) {
      this.hitboxImage.body.offset.x = 0
    }

    this.mob.scene.time.delayedCall(200, () => {
      this.hitboxCollider.active = true
      switch (direction) {
        case Direction.UP: {
          this.hitboxImage.setPosition(
            this.mob.sprite.x,
            this.mob.sprite.y - attackConfig.attackRange
          )
          break
        }
        case Direction.DOWN: {
          this.hitboxImage.setPosition(
            this.mob.sprite.x,
            this.mob.sprite.y + attackConfig.attackRange
          )
          break
        }
        case Direction.LEFT: {
          this.hitboxImage.setPosition(
            this.mob.sprite.x - attackConfig.attackRange,
            this.mob.sprite.y
          )
          break
        }
        case Direction.RIGHT: {
          this.hitboxImage.setPosition(
            this.mob.sprite.x + attackConfig.attackRange,
            this.mob.sprite.y
          )
          break
        }
      }
    })
  }

  isPlayerInAttackRange() {
    const gameScene = this.mob.scene as Game
    const player = gameScene.player
    const dx = Math.floor(this.mob.sprite.x - player.x)
    const dy = Math.floor(this.mob.sprite.y - player.y)

    // If the dx and dy are within the attack range, return null (which signals to attack)
    return Math.abs(dx) < this.attackRange && Math.abs(dy) < this.attackRange
  }

  moveInDirection(direction: Direction) {
    switch (direction) {
      case Direction.UP: {
        this.mob.sprite.setVelocity(0, -this.chaseSpeed)
        break
      }
      case Direction.DOWN: {
        this.mob.sprite.setVelocity(0, this.chaseSpeed)
        break
      }
      case Direction.LEFT: {
        this.mob.sprite.setVelocity(-this.chaseSpeed, 0)
        break
      }
      case Direction.RIGHT: {
        this.mob.sprite.setVelocity(this.chaseSpeed, 0)
        break
      }
    }
  }

  getDirectionToMove(): any {
    const gameScene = this.mob.scene as Game
    const player = gameScene.player
    const dx = Math.floor(this.mob.sprite.x - player.x)
    const dy = Math.floor(this.mob.sprite.y - player.y)

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

  stop() {
    this.mob.sprite.setVelocity(0)
    this.isActive = false
  }

  start() {
    this.isActive = true
  }

  destroy() {
    this.stop()
    if (this.hitboxImage) {
      this.hitboxImage.destroy()
    }
  }
}
