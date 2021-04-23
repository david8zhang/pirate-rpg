import { Constants } from '../../utils/Constants'
import { Mob } from '../../mobs/Mob'
import Game from '../../scenes/Game'
import { Direction } from './Behavior'
import Player from '~/characters/Player'

export class PlayerMobCollision {
  private scene: Game
  private mob: Mob
  public isHit: boolean = false
  public weaponCollider!: Phaser.Physics.Arcade.Collider

  constructor(scene: Game, mob: Mob) {
    this.scene = scene
    this.mob = mob
    this.scene.physics.add.collider(
      this.mob.sprite,
      this.scene.player,
      this.handlePlayerAttack,
      undefined,
      this
    )
  }

  updatePlayerWeaponCollider() {
    const weapon = this.scene.player.getWeapon()
    if (weapon) {
      this.weaponCollider = this.scene.physics.add.collider(
        this.mob.sprite,
        weapon.hitboxImage,
        this.handlePlayerWeaponAttack,
        undefined,
        this
      )
    }
  }

  handlePlayerWeaponAttack() {
    const weapon = this.scene.player.getWeapon()
    if (weapon && this.scene.player.getCurrState() === 'attack' && !this.isHit) {
      const damage = weapon.damage
      this.handleMobHit(damage)
    }
  }

  handleMobHit(damage: number = Player.UNARMED_DAMAGE) {
    this.scene.cameras.main.shake(100, 0.005)
    this.isHit = true
    this.mob.activeBehavior.stop()

    this.mob.takeDamage(damage)
    this.playHurtAnimBasedOnDirection()
    if (this.mob.health === 0) {
      this.mob.die()
    } else {
      this.mob.sprite.setTint(0xff0000)
      this.scene.time.delayedCall(Constants.ATTACK_DURATION, () => {
        this.isHit = false
        this.mob.sprite.setTint(0xffffff)
        this.mob.activeBehavior.start()
      })
    }
  }

  handlePlayerAttack() {
    const weapon = this.scene.player.getWeapon()
    if (weapon && weapon.isEquipped) {
      return
    }
    if (this.scene.player.getCurrState() === 'attack' && !this.isHit) {
      this.handleMobHit()
    }
  }

  playHurtAnimBasedOnDirection() {
    const { sprite, animations, activeBehavior } = this.mob
    if (!animations.hurtBack || !animations.hurtFront || !animations.hurtSide) {
      return
    }
    switch (activeBehavior.direction) {
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
