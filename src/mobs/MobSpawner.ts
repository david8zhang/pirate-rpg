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
  private spawnMobsEvent: Phaser.Time.TimerEvent
  private clearDeadMobsEvent: Phaser.Time.TimerEvent

  constructor(scene: Game, mobSpawnerConfig: MobSpawnerConfig) {
    this.scene = scene
    this.mobConfig = mobSpawnerConfig.mobConfig
    this.spawnPos = mobSpawnerConfig.position
    this.mobLimit = mobSpawnerConfig.mobLimit

    this.spawnMobs()
    this.spawnMobsEvent = this.scene.time.addEvent({
      callback: () => {
        this.spawnMobs()
      },
      delay: mobSpawnerConfig.spawnDelay,
      loop: true,
    })

    this.clearDeadMobsEvent = this.scene.time.addEvent({
      callback: () => {
        this.clearDeadMobs()
      },
      delay: 20000,
      loop: true,
    })
  }

  destroy() {
    this.spawnMobsEvent.destroy()
    this.clearDeadMobsEvent.destroy()
  }

  spawnMobs() {
    if (
      this.spawnedMobs.length === this.mobLimit ||
      !this.scene.hasAvailableMobInPool() ||
      !this.scene.cameras.main.worldView.contains(this.spawnPos.x, this.spawnPos.y)
    ) {
      return
    }
    try {
      const randXOffset = Constants.getRandomNum(-10, 10)
      const randYOffset = Constants.getRandomNum(-10, 10)
      let recycledMob: Mob | null = null
      if (this.scene.isMobPoolFull()) {
        recycledMob = this.scene.getAvailableMobInPool()
        if (recycledMob) {
          recycledMob.initNewConfig(
            this.spawnPos.x + randXOffset,
            this.spawnPos.y + randYOffset,
            this.mobConfig,
            this
          )
          recycledMob.removeFromPrevSpawner()
        }
      } else {
        recycledMob = new Mob(
          this.scene,
          this.spawnPos.x + randXOffset,
          this.spawnPos.y + randYOffset,
          this.mobConfig,
          this
        )
        this.spawnedMobs.push(recycledMob)
        this.scene.addMob(recycledMob)
      }
    } catch (err) {}
  }

  removeMobFromSpawnerList(mob: Mob) {
    this.spawnedMobs = this.spawnedMobs.filter((m: Mob) => m !== mob)
  }

  clearDeadMobs() {
    this.spawnedMobs = this.spawnedMobs.filter((mob) => mob.health > 0)
  }
}
