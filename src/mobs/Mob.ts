import { RandomMovementBehavior } from '../lib/components/RandomMovementBehavior'
import { HealthBar } from '../ui/HealthBar'
import { Behavior, Direction } from '../lib/components/Behavior'
import Game from '../scenes/Game'
import { ItemFactory } from '~/objects/ItemFactory'
import { AnimationType, CAPTAIN_TO_CREW_TYPE, Constants } from '~/utils/Constants'
import { MeleeAttackBehavior } from '~/lib/components/MeleeAttackBehavior'
import { ParticleSpawner } from '~/lib/components/ParticleSpawner'
import { SailingBehavior } from '~/lib/components/SailingBehavior'
import { EnemyShip } from '~/objects/EnemyShip'
import { MobSpawner } from './MobSpawner'
import { UINumber } from '../ui/UINumber'
import { Ship } from '~/objects/Ship'

export interface MobAnimation {
  key: string
  frames: {
    start: number
    end: number
    suffix: string
  }
  repeat: number
  frameRate: number
}

export class Mob {
  scene: Phaser.Scene
  x: number
  y: number
  maxHealth: number
  health: number
  sprite: Phaser.Physics.Arcade.Sprite
  isAggro: boolean = false
  drops: string[] = []
  mobConfig: any
  isHit: boolean = false
  currShip: Ship | null = null

  // Components
  activeBehavior: Behavior
  healthBar: HealthBar
  animations: {
    [key: string]: string
  } = {}
  tileColliders: Phaser.Physics.Arcade.Collider[] = []
  spawner?: MobSpawner

  constructor(scene: Phaser.Scene, x: number, y: number, mobConfig: any, spawner?: MobSpawner) {
    const { animFrameName, animMapping, collidableLayers } = mobConfig
    this.mobConfig = mobConfig
    this.scene = scene
    this.x = x
    this.y = y
    this.spawner = spawner

    this.maxHealth = mobConfig.health
    this.health = mobConfig.health
    this.sprite = scene.physics.add.sprite(x, y, animFrameName)
    this.sprite.setData('ref', this)

    this.sprite.setOrigin(0)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.sprite.setPushable(false)
    this.animations = animMapping
    this.drops = mobConfig.drops

    if (this.mobConfig.body) {
      const body = this.mobConfig.body
      this.sprite.body.setSize(this.sprite.width * body.width, this.sprite.height * body.height)
      if (body.offsetY) {
        this.sprite.body.offset.y = body.offsetY
      }
      if (body.offsetX) {
        this.sprite.body.offset.x = body.offsetX
      }
    }
    const healthBarWidth = this.sprite.width * 1.5
    const healthBarConfig = {
      x: this.sprite.x - healthBarWidth / 2,
      y: this.sprite.y - this.sprite.height,
      width: healthBarWidth,
      height: 3,
      maxValue: this.maxHealth,
      fillColor: 0x00ff00,
      showBorder: false,
      borderWidth: 0,
    }
    this.healthBar = new HealthBar(scene, healthBarConfig)
    this.healthBar.setVisible(false)
    collidableLayers?.forEach((layerName: string) => {
      const layer = (this.scene as Game)
        .getAllTileLayers()
        .find((l) => l.layer.name.toLowerCase() === layerName.toLowerCase())
      if (layer) {
        const collider = this.scene.physics.add.collider(
          layer,
          this.sprite,
          (obj1: any, obj2: any) => this.handleTileCollision(obj1, obj2, animMapping),
          undefined,
          this
        )
        this.tileColliders.push(collider)
      }
    })

    this.activeBehavior = new RandomMovementBehavior(
      this.sprite,
      this.scene,
      this.animations,
      () => {}
    )
    this.sprite.setData('ref', this)
  }

  removeFromPrevSpawner() {
    if (this.spawner) this.spawner.removeMobFromSpawnerList(this)
  }

  initNewConfig(x: number, y: number, mobConfig: any, spawner: MobSpawner) {
    const { animFrameName, animMapping, collidableLayers } = mobConfig
    this.mobConfig = mobConfig
    this.x = x
    this.y = y
    this.spawner = spawner

    this.maxHealth = mobConfig.health
    this.health = mobConfig.health
    this.maxHealth = mobConfig.health
    this.health = mobConfig.health
    this.activeBehavior.stop()
    this.sprite.anims.stop()
    this.sprite.setTexture(animFrameName)
    this.sprite.setData('ref', this)

    this.sprite.setOrigin(0)
    this.sprite.x = x
    this.sprite.y = y
    this.animations = animMapping
    this.drops = mobConfig.drops

    if (mobConfig.body) {
      const body = mobConfig.body
      this.sprite.body.setSize(this.sprite.width * body.width, this.sprite.height * body.height)
      if (body.offsetY) {
        this.sprite.body.offset.y = body.offsetY
      }
      if (body.offsetX) {
        this.sprite.body.offset.x = body.offsetX
      }
    }

    // Reinitialize tile collider
    this.tileColliders.forEach((c) => {
      if (c) {
        c.destroy()
      }
    })
    this.tileColliders = []
    collidableLayers?.forEach((layerName: string) => {
      const layer = (this.scene as Game)
        .getAllTileLayers()
        .find((l) => l.layer.name.toLowerCase() === layerName.toLowerCase())
      if (layer) {
        const collider = this.scene.physics.add.collider(
          layer,
          this.sprite,
          (obj1: any, obj2: any) => this.handleTileCollision(obj1, obj2, animMapping),
          undefined,
          this
        )
        this.tileColliders.push(collider)
      }
    })

    // Re-initialize health bar
    this.healthBar.destroy()
    const healthBarWidth = this.sprite.width * 1.5
    const healthBarConfig = {
      x: this.sprite.x - healthBarWidth / 2,
      y: this.sprite.y - this.sprite.height,
      width: healthBarWidth,
      height: 3,
      maxValue: this.maxHealth,
      fillColor: 0x00ff00,
      showBorder: false,
      borderWidth: 0,
    }
    this.healthBar = new HealthBar(this.scene, healthBarConfig)
    this.healthBar.setVisible(false)

    this.setActiveBehavior(
      new RandomMovementBehavior(this.sprite, this.scene, this.animations, () => {})
    )
  }

  setActiveBehavior(behavior: Behavior) {
    this.activeBehavior.stop()
    this.activeBehavior = behavior
    this.activeBehavior.start()
  }

  handleTileCollision(obj1: any, obj2: any, animations: any) {
    this.activeBehavior.handleTileCollision(obj1, obj2, animations)
  }

  die(): void {
    const gameScene = this.scene as Game
    gameScene.removeMobFromPool(this)
    this.activeBehavior.destroy()
    this.sprite.on('animationcomplete', () => {
      this.scene.time.delayedCall(300, () => {
        this.sprite.destroy()
        if (this.drops.length > 0) {
          this.drops.forEach((dropName: string) => {
            const item = ItemFactory.instance.createItem(dropName, this.sprite.x, this.sprite.y)
            if (item) {
              item.drop()
            }
          })
        }
      })
    })
    this.sprite.setVelocity(0)
    if (this.activeBehavior.direction === Direction.DOWN) {
      this.sprite.anims.play(this.animations[AnimationType.DIE_FRONT])
    } else if (this.activeBehavior.direction === Direction.UP) {
      this.sprite.anims.play(this.animations[AnimationType.DIE_BACK])
    } else {
      this.sprite.anims.play(this.animations[AnimationType.DIE_SIDE])
    }
    this.activeBehavior.destroy()
    this.healthBar.destroy()
  }

  destroy() {
    const gameScene = this.scene as Game
    gameScene.removeMobFromPool(this)
    this.currShip = null
    this.activeBehavior.stop()
    this.activeBehavior.destroy()
    this.healthBar.destroy()
    this.sprite.destroy()
  }

  playHurtAnimBasedOnDirection() {
    const { sprite, animations, activeBehavior } = this
    if (!animations.hurtBack || !animations.hurtFront || !animations.hurtSide) {
      return
    }
    switch (activeBehavior.direction) {
      case Direction.UP: {
        sprite.anims.play(animations.hurtBack)
        break
      }
      case Direction.DOWN: {
        sprite.anims.play(animations.hurtFront)
        break
      }
      case Direction.LEFT:
      case Direction.RIGHT:
        sprite.anims.play(animations.hurtSide)
        break
      default:
        sprite.anims.play(animations.hurtFront)
        break
    }
  }

  startSailing(ship: EnemyShip) {
    if (this.mobConfig.canSail) {
      this.setActiveBehavior(new SailingBehavior(this, ship))
      this.currShip = ship
    }
  }

  stopSailing() {
    this.setActiveBehavior(
      new RandomMovementBehavior(this.sprite, this.scene, this.animations, () => {})
    )
  }

  onHit(damage: number) {
    if (!this.isHit) {
      this.scene.cameras.main.shake(100, 0.005)
      this.isHit = true
      ParticleSpawner.instance.spawnParticle('blood-particle', this.sprite.x, this.sprite.y, 4)
      this.activeBehavior.stop()
      this.takeDamage(damage)
      this.playHurtAnimBasedOnDirection()
      if (this.health === 0) {
        this.die()
      } else {
        this.sprite.setTint(0xff0000)
        this.scene.time.delayedCall(Constants.ATTACK_DURATION, () => {
          this.isHit = false
          this.sprite.setTint(0xffffff)
          this.activeBehavior.start()
        })
      }
    }
  }

  takeDamage(damage: number) {
    this.health -= damage
    this.health = Math.max(0, this.health)
    this.healthBar.decrease(damage)
    this.healthBar.setVisible(true)
    UINumber.createNumber(`-${damage}`, this.scene, this.sprite.x, this.sprite.y - 10)
    if (!this.isAggro && this.mobConfig.aggroBehavior) {
      const behaviorMapping = {
        Melee: MeleeAttackBehavior,
      }
      const Behavior = behaviorMapping[this.mobConfig.aggroBehavior]
      if (Behavior) {
        this.setActiveBehavior(new Behavior(this))
        this.isAggro = true
      }
    }
  }

  makeAggro() {
    this.isAggro = true
    const behaviorMapping = {
      Melee: MeleeAttackBehavior,
    }
    const Behavior = behaviorMapping[this.mobConfig.aggroBehavior]
    if (Behavior) {
      this.setActiveBehavior(new Behavior(this))
      this.isAggro = true
    }
  }

  update() {
    if (!this.sprite.active) {
      return
    }

    if (this.sprite.active && this.mobConfig.moveOffsets) {
      if (this.sprite.body.velocity.x < 0) {
        this.sprite.scaleX = 1
        this.sprite.body.offset.x = this.mobConfig.moveOffsets.left
      } else if (this.sprite.body.velocity.x > 0) {
        this.sprite.body.offset.x = this.mobConfig.moveOffsets.right
        this.sprite.scaleX = -1
      } else if (this.sprite.body.velocity.y != 0) {
        this.sprite.body.offset.x = this.mobConfig.moveOffsets.left
        this.sprite.scaleX = 1
      }
    }

    if (Game.instance.player.isDead && this.isAggro) {
      this.isAggro = false
      // Disable whatever current behavior is running and start the random movement behavior
      this.activeBehavior.disable()
      this.activeBehavior = new RandomMovementBehavior(
        this.sprite,
        this.scene,
        this.animations,
        () => {}
      )
      this.healthBar.setVisible(false)
    }

    // If this mob is currently colliding with a ship wheel and there's no players on this ship, start the sailing behavior

    this.healthBar.x = this.sprite.x - this.healthBar.width / 2
    this.healthBar.y = this.sprite.y - this.sprite.height / 2
    this.healthBar.draw()
    this.activeBehavior.update()
  }

  // Take control of the ship and start sailing it if not currently sailing and collides with wheel
  takeControlOfShip(ship: Ship) {
    const gameScene = this.scene as Game
    if (this.mobConfig.canSail && this.activeBehavior.name !== 'SAIL') {
      ship.destroy()
      const newEnemyShip = new EnemyShip(
        gameScene,
        ship.shipConfig,
        {
          x: ship.hullSprite.x,
          y: ship.hullSprite.y,
        },
        ship.currDirection
      )
      const newMob = new Mob(this.scene, this.sprite.x, this.sprite.y, this.mobConfig)
      gameScene.addShip(newEnemyShip)
      gameScene.addMob(newMob)
      newMob.startSailing(newEnemyShip)
      newEnemyShip.setMobInControl(newMob)
      newEnemyShip.setCrew(CAPTAIN_TO_CREW_TYPE[this.mobConfig.name], ship.shipConfig.numCrew)
      this.destroy()
    }
  }
}
