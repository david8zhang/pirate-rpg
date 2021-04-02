import { Mob, MobConfig } from './Mob'

export class GiantCrab extends Mob {
  constructor(scene: Phaser.Scene, config: MobConfig) {
    super(scene, config, {
      idleFront: 'giant-crab-idle',
      idleSide: '',
      idleBack: '',
      moveFront: 'giant-crab-idle',
      moveSide: '',
      moveBack: '',
      dieFront: '',
      dieSide: '',
      dieBack: '',
      hurtFront: '',
      hurtBack: '',
      hurtSide: '',
    })
    this.sprite.anims.play('giant-crab-idle')
  }
}
