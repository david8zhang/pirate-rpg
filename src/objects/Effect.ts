import Game from '~/scenes/Game'

export interface EffectConfig {
  animation: any
  name: string
  animName: string
}

export class Effect {
  public sprite: Phaser.Physics.Arcade.Sprite
  constructor(scene: Game, effectConfig: EffectConfig, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, effectConfig.name)
    this.sprite.play(effectConfig.animName)
  }
}
