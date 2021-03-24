import { Mob, MobConfig } from './Mob'

export class Crab extends Mob {
  public isWalkAnimPlaying: boolean = false
  constructor(scene: Phaser.Scene, mobConfig: MobConfig) {
    super(scene, mobConfig, {
      move: 'crab-walk-side',
      idle: 'crab-idle',
    })
  }

  update() {
    super.update()
  }
}
