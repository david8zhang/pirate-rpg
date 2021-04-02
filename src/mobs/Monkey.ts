import { Direction } from '../lib/components/MovementBehavior'
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
  hurtFront: 'monkey-hurt-front',
  hurtSide: 'monkey-hurt-side',
  hurtBack: 'monkey-hurt-back',
}

export class Monkey extends Mob {
  private playerMobCollision: PlayerMobCollision
  constructor(scene: Game, mobConfig: MobConfig) {
    super(scene, mobConfig, MONKEY_ANIMATIONS, [scene.oceanLayer, scene.sandLayer])
    this.health = 50
    this.maxHealth = 50
    this.playerMobCollision = new PlayerMobCollision(scene as Game, this)
    this.healthBar.maxValue = this.maxHealth
    this.healthBar.currValue = this.health
    this.sprite.body.setSize(this.sprite.width * 0.6, this.sprite.height * 0.5)
    this.sprite.body.offset.y = 15
  }

  public update() {
    if (this.sprite.active) {
      switch (this.moveBehavior.direction) {
        case Direction.LEFT:
          this.sprite.scaleX = 1
          this.sprite.body.offset.x = 8
          break
        case Direction.RIGHT:
          this.sprite.body.offset.x = 25
          this.sprite.scaleX = -1
          break
      }
    }
    super.update()
  }

  die() {
    this.sprite.on('animationcomplete', () => {
      this.scene.time.delayedCall(300, () => {
        this.sprite.destroy()
      })
    })
    super.die()
  }
}
