import { Mob, MobConfig } from './Mob'

export class GiantCrab extends Mob {
  constructor(scene: Phaser.Scene, config: MobConfig) {
    super(scene, config)
    this.sprite.anims.play('giant-crab-idle')
  }
}
