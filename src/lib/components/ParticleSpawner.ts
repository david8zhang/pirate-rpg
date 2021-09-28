import { Item } from '../../objects/Item'
import Game from '../../scenes/Game'

export class ParticleSpawner {
  private scene: Game
  private static _instance: ParticleSpawner

  constructor(scene: Game) {
    this.scene = scene
    ParticleSpawner._instance = this
  }

  spawnParticle(
    particleName: string,
    x: number,
    y: number,
    quantity: number,
    dropLength?: number,
    onDestroy?: Function
  ) {
    let items: Item[] = []
    for (let i = 0; i < quantity; i++) {
      const item = new Item(this.scene, x, y, particleName, dropLength || 500, true)
      item.drop()
      items.push(item)
    }
    this.scene.time.delayedCall(2000, () => {
      items.forEach((item: Item) => {
        item.destroy()
      })
      if (onDestroy) {
        onDestroy()
      }
    })
  }

  public static get instance(): ParticleSpawner {
    return this._instance
  }
}
