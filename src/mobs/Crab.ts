import Game from '../scenes/Game'
import { Mob, MobConfig } from './Mob'

export class Crab extends Mob {
  public isWalkAnimPlaying: boolean = false
  constructor(scene: Phaser.Scene, mobConfig: MobConfig) {
    super(scene, mobConfig, {
      moveFront: 'crab-walk-front',
      moveSide: 'crab-walk-side',
      idleFront: 'crab-idle-front',
      idleSide: 'crab-idle-side',
    })
  }

  update() {
    super.update()
  }
}
