import { Mob, MobConfig } from './Mob'

export class GiantCrab extends Mob {
  constructor(scene: Phaser.Scene, config: MobConfig) {
    super(scene, config, {
      idleFront: 'giant-crab-idle',
      moveFront: 'giant-crab-idle',
      idleSide: '',
      moveSide: '',
    })
    this.sprite.anims.play('giant-crab-idle')
  }
}
