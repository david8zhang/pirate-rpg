import Game from '../scenes/Game'
import { Direction } from '../lib/components/MovementScript'

import { Mob, MobConfig } from './Mob'
import { PlayerMobCollision } from '../lib/components/PlayerMobCollision'

const CRAB_ANIMATIONS = {
  moveFront: 'crab-walk-front',
  moveSide: 'crab-walk-side',
  idleFront: 'crab-idle-front',
  idleSide: 'crab-idle-side',
}

export class Crab extends Mob {
  public isWalkAnimPlaying: boolean = false
  public isHit = false
  private playerMobCollision: PlayerMobCollision
  constructor(scene: Phaser.Scene, mobConfig: MobConfig) {
    super(scene, mobConfig, CRAB_ANIMATIONS)
    this.health = 20
    this.maxHealth = 20
    this.playerMobCollision = new PlayerMobCollision(scene as Game, this)
  }

  update() {
    super.update()
  }

  die() {
    this.sprite.on('animationcomplete', () => {
      this.sprite.destroy()
    })
    this.sprite.setVelocity(0)
    if (this.moveComp.direction === Direction.UP || this.moveComp.direction === Direction.DOWN) {
      this.sprite.anims.play('crab-die-side')
    } else {
      this.sprite.anims.play('crab-die-front')
    }
    this.moveComp.destroy()
  }
}
