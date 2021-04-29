import Player, { Direction } from '~/characters/Player'
import { ParticleSpawner } from '~/lib/components/ParticleSpawner'
import Game from '~/scenes/Game'
import { Constants } from '~/utils/Constants'
import { ItemConfig } from './ItemConfig'
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
  droppedItems?: string[]
  onDropItem?: Function
}

export class Harvestable {
  public health: number
  private scene: Game
  public sprite: Phaser.Physics.Arcade.Sprite
  public config: HarvestableConfig
  public onDropItem?: Function
  public isAttacked: boolean = false
  public currPlayerWeapon: string = 'unarmed'

  constructor(scene: Game, config: HarvestableConfig) {
    const { xPos, yPos, texture, bodyResize, health, defaultFrame, onDropItem } = config
    this.scene = scene
    this.config = config
    this.sprite = this.scene.physics.add.sprite(xPos, yPos, texture, defaultFrame)
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
  }

  handlePlantPlayerCollision() {
    if (this.scene.player.getCurrState() === 'attack' && !this.isAttacked) {
      const weapon = this.scene.player.getWeapon()
      this.takeDamage(weapon ? weapon.damage : Player.UNARMED_DAMAGE)
      const offsetX = this.getParticleExplosionOffset()
      let x = weapon ? weapon.hitboxImage.x : this.scene.player.x
      let y = weapon ? weapon.hitboxImage.y : this.scene.player.y

      ParticleSpawner.instance.spawnParticle('wood-particle', x + offsetX, y + 5, 5)
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
      if (this.onDropItem) this.onDropItem(this)
      this.dropItems()
    }
    this.health -= damage
    this.health = Math.max(0, this.health)
    this.scene.cameras.main.shake(Constants.ATTACK_DURATION / 2, 0.002)
  }

  dropItems() {
    const { droppedItems } = this.config
    if (droppedItems) {
      const dropItemName = droppedItems[Math.floor(Math.random() * droppedItems.length)]
      const dropItem = ItemFactory.instance.createItem(
        dropItemName,
        this.sprite.x,
        this.sprite.y - this.sprite.height / 2 + 10
      )
      if (dropItem) {
        dropItem?.drop()
      }
    }
  }
}
