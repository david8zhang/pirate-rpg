import { Direction } from '~/characters/Player'
import Game from '../scenes/Game'
import { Projectile } from './Projectile'
import { Ship } from './Ship'

interface CannonConfig {
  x: number
  y: number
  body?: {
    height?: number
    width?: number
    offsetX?: number
    offsetY?: number
  }
  size: {
    width: number
    height: number
  }
  scaleX?: number
  scaleY?: number
  texture: string
  displayHeight?: number
  displayWidth?: number
  direction: Direction
  projectileInitPosition?: {
    xOffset: number
    yOffset: number
  }
}

export class Cannon {
  private scene: Game
  private sprite: Phaser.Physics.Arcade.Sprite
  private playerOverlap: Phaser.Physics.Arcade.Collider
  private fireable: boolean = false
  private isFiring: boolean = false
  public direction: Direction

  private projectileInitPosition?: {
    xOffset: number
    yOffset: number
  }

  constructor(scene: Game, config: CannonConfig) {
    this.scene = scene
    this.direction = config.direction
    if (config.projectileInitPosition) {
      this.projectileInitPosition = config.projectileInitPosition
    }
    this.sprite = this.scene.physics.add.sprite(config.x, config.y, config.texture)
    this.scene.physics.world.enableBody(this.sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.setScale(config.scaleX, config.scaleY)
    this.setBody(config.body ? config.body : null)
    this.playerOverlap = this.scene.physics.add.overlap(this.sprite, this.scene.player, () => {
      if (this.scene.player.ship) {
        this.scene.hoverText.showText(
          '(E) Fire',
          this.scene.player.x - this.scene.player.width / 2,
          this.scene.player.y + this.scene.player.height / 2
        )
        this.fireable = true
      }
    })
    this.scene.input.keyboard.on('keydown', (keycode: any) => {
      if (keycode.code === 'KeyE') {
        if (this.fireable) {
          this.fireCannon()
        }
      }
    })
  }

  fireCannon() {
    if (!this.isFiring) {
      this.scene.cameras.main.shake(100, 0.005)
      let xPos = this.sprite.x
      let yPos = this.sprite.y
      if (this.projectileInitPosition) {
        const { xOffset, yOffset } = this.projectileInitPosition
        xPos += xOffset
        yPos += yOffset
      }
      this.isFiring = true
      const cannonball = new Projectile(this.scene, xPos, yPos, 'cannonball')
      cannonball.fire(this.direction, 300)
      this.scene.time.delayedCall(1500, () => {
        this.isFiring = false
      })
    }
  }

  setPosition(x: number, y: number) {
    this.sprite.setX(x)
    this.sprite.setY(y)
  }

  setBody(
    config: {
      width?: number
      height?: number
      offsetX?: number
      offsetY?: number
    } | null
  ) {
    if (!config) {
      return
    }
    const { width, height, offsetX, offsetY } = config
    const bodyWidth = width ? width : 1
    const bodyHeight = height ? height : 1
    this.sprite.body.setSize(this.sprite.width * bodyWidth, this.sprite.height * bodyHeight)

    if (offsetX) {
      this.sprite.body.offset.x = offsetX
    }
    if (offsetY) {
      this.sprite.body.offset.y = offsetY
    }
  }

  setTexture(texture: string) {
    this.sprite.setTexture(texture)
  }

  setScale(scaleX: number | undefined, scaleY: number | undefined) {
    if (scaleX !== undefined) {
      this.sprite.scaleX = scaleX
    }
    if (scaleY !== undefined) {
      this.sprite.scaleY = scaleY
    }
  }

  update() {
    if (!this.sprite.body.embedded) {
      this.fireable = false
    }
  }

  destroy() {
    this.sprite.destroy()
    this.playerOverlap.destroy()
  }
}
