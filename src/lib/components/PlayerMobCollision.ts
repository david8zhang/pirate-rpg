import { Constants } from '~/utils/Constants'
import { Mob } from '../../mobs/Mob'
import Game from '../../scenes/Game'
import { Direction } from './MovementBehavior'

export class PlayerMobCollision {
  private scene: Game
  private mob: Mob
  private collider: Phaser.Physics.Arcade.Collider
  private isHit: boolean = false

  constructor(scene: Game, mob: Mob) {
    this.scene = scene
    this.mob = mob

    this.collider = this.scene.physics.add.collider(
      this.mob.sprite,
      this.scene.player,
      this.handlePlayerAttack,
      undefined,
      this
    )
  }

  handlePlayerAttack() {
    if (this.scene.player.getCurrState() === 'attack' && !this.isHit) {
      this.scene.cameras.main.shake(100, 0.005)
      this.isHit = true
      this.mob.moveBehavior.stop()
      this.mob.takeDamage(10)
      this.playHurtAnimBasedOnDirection()
      if (this.mob.health === 0) {
        this.mob.die()
      } else {
        this.mob.sprite.setTint(0xff0000)
        this.scene.time.delayedCall(Constants.ATTACK_DURATION, () => {
          this.isHit = false
          this.mob.sprite.setTint(0xffffff)
          this.mob.moveBehavior.start()
        })
      }
    }
  }

  playHurtAnimBasedOnDirection() {
    const { sprite, animations, moveBehavior } = this.mob
    if (!animations.hurtBack || !animations.hurtFront || !animations.hurtSide) {
      return
    }
    switch (moveBehavior.direction) {
      case Direction.UP: {
        sprite.anims.play(animations.hurtBack)
        break
      }
      case Direction.DOWN: {
        sprite.anims.play(animations.hurtFront)
        break
      }
      case Direction.LEFT:
      case Direction.RIGHT:
        sprite.anims.play(animations.hurtSide)
        break
      default:
        sprite.anims.play(animations.hurtFront)
        break
    }
  }
}
