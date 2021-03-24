import { Mob, MobConfig } from './Mob'

export class GiantCrab extends Mob {
  constructor(scene: Phaser.Scene, config: MobConfig) {
    super(scene, config, {
      idle: 'giant-crab-idle',
      move: 'giant-crab-idle',
    })
    this.sprite.anims.play('giant-crab-idle')
  }
}
