import { PlayerMobCollision } from '../lib/components/PlayerMobCollision'
import Game from '../scenes/Game'
import { Mob, MobConfig } from './Mob'

const MONKEY_ANIMATIONS = {
  moveFront: 'monkey-walk-front',
  moveSide: 'monkey-walk-side',
  moveBack: 'monkey-walk-back',
  idleFront: 'monkey-idle-front',
  idleSide: 'monkey-idle-side',
  idleBack: 'monkey-idle-back',
  dieFront: 'monkey-die-front',
  dieSide: 'monkey-die-side',
  dieBack: 'monkey-die-back',
}

export class Monkey extends Mob {
  private playerMobCollision: PlayerMobCollision
  constructor(scene: Phaser.Scene, mobConfig: MobConfig) {
    super(scene, mobConfig, MONKEY_ANIMATIONS)
    this.health = 50
    this.maxHealth = 50
    this.playerMobCollision = new PlayerMobCollision(scene as Game, this)
    this.healthBar.maxValue = this.maxHealth
    this.healthBar.currValue = this.health
  }
}
