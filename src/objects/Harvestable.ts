import Player, { Direction } from '~/characters/Player'
import { ParticleSpawner } from '~/lib/components/ParticleSpawner'
import Game from '~/scenes/Game'
import { UINumber } from '~/ui/UINumber'
import { Constants } from '~/utils/Constants'
import { Item } from './Item'
import { ItemFactory } from './ItemFactory'

export interface HarvestableConfig {
  texture: string
  name: string
  xPos: number
  yPos: number
  health: number
  defaultFrame?: number
  bodyResize?: {
    width?: number
    height?: number
    offset?: {
      x?: number
      y?: number
    }
  }
  dropConfig: {
    withDropTexture?: string
    hasDropRate?: number
    droppedItems?: {
      name: string
      quantity: number
    }[]
    onDestroyDrops?: {
      name: string
      quantity: number
    }[]
    onDropItem?: Function
  }
  particle?: {
    type: string
    dropLength: number
  }
  proximityItems: {
    name: string
    max: number
  }[]
}

export class Harvestable {
  public health: number
  private scene: Game
  public tileCoords: {
    x: number
    y: number
  } = {
    x: 0,
    y: 0,
  }
  public sprite: Phaser.Physics.Arcade.Sprite
  public config: HarvestableConfig
  public onDropItem?: Function
  public isAttacked: boolean = false
  public currPlayerWeapon: string = 'unarmed'
  public proximityItems: Item[] = []
  public canDrop: boolean = false

  constructor(scene: Game, config: HarvestableConfig, tileCoords: { x: number; y: number }) {
    const { xPos, yPos, texture, bodyResize, health, dropConfig } = config
    const { onDropItem } = dropConfig
    this.tileCoords = tileCoords
    this.scene = scene
    this.config = config
    this.sprite = this.scene.physics.add.sprite(xPos, yPos, texture)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.health = health

    if (onDropItem) {
      this.onDropItem = onDropItem
    }

    if (bodyResize) {
      const { width, height } = bodyResize
      const newWidth = width ? this.sprite.width * width : this.sprite.width * 1
      const newHeight = height ? this.sprite.height * height : this.sprite.height * 1
      this.sprite.body.setSize(newWidth, newHeight)

      if (bodyResize.offset && bodyResize.offset.y) {
        this.sprite.body.offset.y = bodyResize.offset.y
      }
      if (bodyResize.offset && bodyResize.offset.x) {
        this.sprite.body.offset.x = bodyResize.offset.x
      }
    }
    this.sprite.setData('ref', this)
    this.sprite.setPushable(false)
    this.initProximityItems()
    this.setHasDrops()
  }

  setHasDrops() {
    const { hasDropRate, withDropTexture } = this.config.dropConfig
    if (hasDropRate && withDropTexture) {
      const randomNum = Constants.getRandomNum(0, 1000)
      if (randomNum < hasDropRate * 1000) {
        this.sprite.setTexture(withDropTexture)
        this.canDrop = true
      }
    } else {
      this.canDrop = true
    }
  }

  initProximityItems() {
    this.config.proximityItems.forEach((config) => {
      const numItems = Constants.getRandomNum(0, config.max)
      for (let i = 0; i < numItems; i++) {
        const itemConfig = Constants.getItem(config.name)
        if (itemConfig) {
          const randXDiff = Constants.getRandomNum(-50, 20)
          const randYDiff = Constants.getRandomNum(10, 20)
          const baseY = this.sprite.y + this.sprite.displayHeight / 2
          const item = ItemFactory.instance.createItem(
            itemConfig.name,
            this.sprite.x + randXDiff,
            baseY + randYDiff
          )
          if (item) {
            this.proximityItems.push(item)
            this.scene.addItem(item)
          }
        }
      }
    })
  }

  initNewConfig(config: HarvestableConfig) {
    const { xPos, yPos, texture, bodyResize, health, defaultFrame, dropConfig } = config
    const { onDropItem } = dropConfig
    this.config = config
    this.sprite.setTexture(texture, defaultFrame)
    this.sprite.x = xPos
    this.sprite.y = yPos
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.health = health

    if (onDropItem) {
      this.onDropItem = onDropItem
    }

    if (bodyResize) {
      const { width, height } = bodyResize
      const newWidth = width ? this.sprite.width * width : this.sprite.width * 1
      const newHeight = height ? this.sprite.height * height : this.sprite.height * 1
      this.sprite.body.setSize(newWidth, newHeight)

      if (bodyResize.offset && bodyResize.offset.y) {
        this.sprite.body.offset.y = bodyResize.offset.y
      }
      if (bodyResize.offset && bodyResize.offset.x) {
        this.sprite.body.offset.x = bodyResize.offset.x
      }
    }
  }

  handlePlayerHarvestableCollision() {
    if (this.scene.player.getCurrState() === 'attack' && !this.isAttacked) {
      const weapon = this.scene.player.getWeapon()
      this.takeDamage(weapon ? weapon.damage : Player.UNARMED_DAMAGE)
      if (this.config.particle) {
        ParticleSpawner.instance.spawnParticle(
          this.config.particle.type,
          this.sprite.x,
          this.sprite.y,
          5,
          this.config.particle.dropLength
        )
      }
      this.isAttacked = true
      this.scene.time.delayedCall(Constants.ATTACK_DURATION, () => {
        this.isAttacked = false
      })
    }
  }

  getParticleExplosionOffset() {
    switch (this.scene.player.direction) {
      case Direction.LEFT: {
        return -15
      }
      case Direction.RIGHT: {
        return 15
      }
      default:
        return 0
    }
  }

  takeDamage(damage: number) {
    if (this.health === this.config.health) {
      if (this.canDrop) {
        if (this.onDropItem) this.onDropItem(this)
        this.dropItems()
      }
    }
    this.health -= damage
    this.health = Math.max(0, this.health)
    if (this.health === 0) {
      this.destroy()
    }
    UINumber.createNumber(`-${damage}`, this.scene, this.sprite.x, this.sprite.y, 'red')
    this.scene.cameras.main.shake(Constants.ATTACK_DURATION / 2, 0.002)
  }

  cleanup() {
    this.proximityItems.map((item) => item.destroy())
    this.sprite.destroy()
  }

  // Items to be dropped when broken completely
  destroy() {
    const { onDestroyDrops } = this.config.dropConfig
    if (onDestroyDrops) {
      onDestroyDrops.forEach((drop) => {
        this.dropItem(drop.name, drop.quantity)
      })
    }
    this.scene.removeHarvestable(this.tileCoords.x, this.tileCoords.y)
    this.sprite.destroy()
  }

  dropItem(itemName: string, quantity: number) {
    for (let i = 0; i < quantity; i++) {
      const dropItem = ItemFactory.instance.createItem(
        itemName,
        this.sprite.x,
        this.sprite.y - this.sprite.height / 2 + 10
      )
      if (dropItem) {
        dropItem.drop()
      }
    }
  }

  // Items to be dropped when hit (trees, bushes, etc. dropping berries/fruits)
  // Interesting idea: Drop mobs when hitting trees, like coconut crabs or bees
  dropItems() {
    const { droppedItems } = this.config.dropConfig
    if (droppedItems) {
      const droppableItem = droppedItems[Math.floor(Math.random() * droppedItems.length)]
      this.dropItem(droppableItem.name, droppableItem.quantity)
    }
  }
}
