import { Constants } from '../../utils/Constants'
import { Mob } from '../../mobs/Mob'
import Game from '../../scenes/Game'
import { Direction } from './Behavior'
import Player from '~/characters/Player'
import { ParticleSpawner } from './ParticleSpawner'

export class PlayerMobCollision {
  private scene: Game
  private mob: Mob
  public isHit: boolean = false
  public weaponCollider!: Phaser.Physics.Arcade.Collider

  constructor(scene: Game, mob: Mob) {
    this.scene = scene
    this.mob = mob
  }

  handlePlayerWeaponAttack() {
    const weapon = this.scene.player.getWeapon()
    if (weapon && this.scene.player.getCurrState() === 'attack' && !this.isHit) {
      const damage = weapon.damage
      this.mob.onHit(damage)
    }
  }

  handlePlayerAttack() {
    const weapon = this.scene.player.getWeapon()
    if (weapon && weapon.isEquipped) {
      return
    }
    if (this.scene.player.getCurrState() === 'attack' && !this.isHit) {
      this.mob.onHit(Player.UNARMED_DAMAGE)
      this.isHit = true
    }
  }
}
