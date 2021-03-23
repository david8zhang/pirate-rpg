import { Mob, MobConfig } from './Mob'

export class Crab extends Mob {
  constructor(scene: Phaser.Scene, mobConfig: MobConfig) {
    super(scene, mobConfig)
    this.sprite.anims.play('crab-idle')
  }
}
