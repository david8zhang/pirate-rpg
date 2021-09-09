import { Constants } from '~/utils/Constants'
import Game from '../scenes/Game'
import { Mob } from './Mob'

interface MobSpawnerConfig {
  position: {
    x: number
    y: number
  }
  spawnDelay: number
  mobConfig: any
  mobLimit: number
}

export class MobSpawner {
  private scene: Game
  private mobConfig: any
  private spawnPos: {
    x: number
    y: number
  }
  private mobLimit: number
  private spawnedMobs: Mob[] = []
  constructor(scene: Game, mobSpawnerConfig: MobSpawnerConfig) {
    this.scene = scene
    this.mobConfig = mobSpawnerConfig.mobConfig
    this.spawnPos = mobSpawnerConfig.position
    this.mobLimit = mobSpawnerConfig.mobLimit

    this.scene.time.addEvent({
      callback: this.spawnMobs,
      callbackScope: this,
      delay: mobSpawnerConfig.spawnDelay,
      loop: true,
    })

    this.scene.time.addEvent({
      callback: this.clearDeadMobs,
      callbackScope: this,
      delay: 20000,
      loop: true,
    })
  }

  spawnMobs() {
    if (
      this.spawnedMobs.length < this.mobLimit &&
      this.scene.cameras.main.worldView.contains(this.spawnPos.x, this.spawnPos.y)
    ) {
      const randXOffset = Constants.getRandomNum(-10, 10)
      const randYOffset = Constants.getRandomNum(-10, 10)
      const mob = new Mob(
        this.scene,
        this.spawnPos.x + randXOffset,
        this.spawnPos.y + randYOffset,
        this.mobConfig
      )
      this.spawnedMobs.push(mob)
      this.scene.addMob(mob)
    }
  }

  clearDeadMobs() {
    this.spawnedMobs = this.spawnedMobs.filter((mob) => mob.health > 0)
  }
}
