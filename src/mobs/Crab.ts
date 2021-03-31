import Game from '../scenes/Game'

import { CrabClaw } from '../items/CrabClaw'
import { Mob, MobConfig } from './Mob'
import { PlayerMobCollision } from '../lib/components/PlayerMobCollision'

const CRAB_ANIMATIONS = {
  moveFront: 'crab-walk-front',
  moveSide: 'crab-walk-side',
  moveBack: 'crab-walk-front',
  idleFront: 'crab-idle-front',
  idleSide: 'crab-idle-side',
  idleBack: 'crab-idle-front',
  dieFront: 'crab-die-front',
  dieSide: 'crab-die-side',
  dieBack: 'crab-die-front',
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
    this.healthBar.maxValue = this.maxHealth
    this.healthBar.currValue = this.health
  }

  update() {
    super.update()
  }

  die() {
    this.sprite.on('animationcomplete', () => {
      this.sprite.destroy()
      const gameScene = this.scene as Game
      const crabClaw = new CrabClaw(gameScene, this.sprite.x, this.sprite.y)
      crabClaw.drop()
    })
    super.die()
  }
}
