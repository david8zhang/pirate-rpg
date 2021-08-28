import Game from '~/scenes/Game'

export interface EffectConfig {
  animation: any
  name: string
  animName: string
  scale: number
  ttl: number
}

export class EffectSpawner {
  private static _instance: EffectSpawner
  constructor() {
    EffectSpawner._instance = this
  }

  public static get instance() {
    return this._instance
  }

  public spawnEffect(effectConfig: EffectConfig, x: number, y: number) {
    const sprite = Game.instance.physics.add
      .sprite(x, y, effectConfig.name)
      .setScale(effectConfig.scale)
    sprite.play(effectConfig.animName)
    Game.instance.time.delayedCall(effectConfig.ttl, () => {
      sprite.destroy()
    })
  }
}
