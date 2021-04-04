import Game from '../scenes/Game'

import { CrabClaw } from '../items/CrabClaw'
import { Mob, MobConfig } from './Mob'
import { PlayerMobCollision } from '../lib/components/PlayerMobCollision'

const CRAB_ANIMATIONS = {
  moveFront: 'crab-walk-side',
  moveSide: 'crab-walk-front',
  moveBack: 'crab-walk-side',
  idleFront: 'crab-idle-side',
  idleSide: 'crab-idle-front',
  idleBack: 'crab-idle-side',
  dieFront: 'crab-die-side',
  dieSide: 'crab-die-front',
  dieBack: 'crab-die-side',
  hurtFront: '',
  hurtBack: '',
  hurtSide: '',
  attackFront: '',
  attackSide: '',
  attackBack: '',
}

export class Crab extends Mob {
  public isWalkAnimPlaying: boolean = false
  constructor(scene: Game, mobConfig: MobConfig) {
    super(scene, mobConfig, CRAB_ANIMATIONS, [scene.oceanLayer, scene.grassLayer])
    this.health = 20
    this.maxHealth = 20
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
