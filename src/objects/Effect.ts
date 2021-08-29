import Game from '~/scenes/Game'

export interface EffectConfig {
  animation: any
  name: string
  scale: {
    x: number
    y: number
  }
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

  public spawnEffect(
    effectConfig: EffectConfig,
    x: number,
    y: number,
    rotationAngle?: number,
    scale?: {
      x?: number
      y?: number
    }
  ) {
    const sprite = Game.instance.physics.add
      .sprite(x, y, effectConfig.name)
      .setScale(effectConfig.scale.x, effectConfig.scale.y)
    sprite.play(effectConfig.animation.key)
    sprite.setDepth(1000)
    sprite.setAngle(rotationAngle)
    if (scale) {
      if (scale.x) {
        sprite.scaleX = scale.x
      }
      if (scale.y) {
        sprite.scaleY = scale.y
      }
    }
    Game.instance.time.delayedCall(effectConfig.ttl, () => {
      sprite.destroy()
    })
  }

  public spawnPersistentEffect(
    effectConfig: EffectConfig,
    x: number,
    y: number,
    rotationAngle?: number,
    scale?: {
      x?: number
      y?: number
    }
  ) {
    const sprite = Game.instance.physics.add
      .sprite(x, y, effectConfig.name)
      .setScale(effectConfig.scale.x, effectConfig.scale.y)
    sprite.play(effectConfig.animation.key)
    sprite.setDepth(1000)
    sprite.setAngle(rotationAngle)
    if (scale) {
      if (scale.x) {
        sprite.scaleX = scale.x
      }
      if (scale.y) {
        sprite.scaleY = scale.y
      }
    }
    return sprite
  }
}
