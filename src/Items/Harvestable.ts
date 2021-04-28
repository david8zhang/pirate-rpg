import Player, { Direction } from '~/characters/Player'
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
  public emitter!: Phaser.GameObjects.Particles.ParticleEmitter

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
    const particles = this.scene.add.particles('wood-particle')
    particles.setName('UI')
    particles.setDepth(1000)
    this.emitter = particles
      .createEmitter({
        x: 100,
        y: 100,
        gravityX: 10,
        gravityY: 200,
        angle: { min: 0, max: 360 },
        speed: 50,
        lifespan: 600,
      })
      .stop()
  }

  handlePlantPlayerCollision() {
    if (this.scene.player.getCurrState() === 'attack') {
      const weapon = this.scene.player.getWeapon()
      this.takeDamage(weapon ? weapon.damage : Player.UNARMED_DAMAGE)
      if (!this.isAttacked && weapon) {
        this.isAttacked = true
        const offsetX = this.getParticleExplosionOffset()
        this.emitter.explode(8, weapon.hitboxImage.x + offsetX, weapon.hitboxImage.y - 10)
        this.emitter.onParticleDeath(() => {
          this.isAttacked = false
        })
      }
    }
  }

  getParticleExplosionOffset() {
    switch (this.scene.player.direction) {
      case Direction.LEFT: {
        return -8
      }
      case Direction.RIGHT: {
        return 8
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
