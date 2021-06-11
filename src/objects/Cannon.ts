import Game from '../scenes/Game'

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
}

export class Cannon {
  private scene: Game
  private sprite: Phaser.Physics.Arcade.Sprite
  private playerOverlap: Phaser.Physics.Arcade.Collider
  constructor(scene: Game, config: CannonConfig) {
    this.scene = scene
    this.sprite = this.scene.physics.add.sprite(
      config.x,
      config.y,
      config.texture
    )
    this.scene.physics.world.enableBody(
      this.sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    )
    this.setScale(config.scaleX, config.scaleY)
    this.setBody(config.body ? config.body : null)
    this.playerOverlap = this.scene.physics.add.overlap(
      this.sprite,
      this.scene.player,
      () => {
        this.scene.hoverText.showText(
          '(E) Fire',
          this.scene.player.x - this.scene.player.width / 2,
          this.scene.player.y + this.scene.player.height / 2
        )
      }
    )
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
    this.sprite.body.setSize(
      this.sprite.width * bodyWidth,
      this.sprite.height * bodyHeight
    )
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
      this.sprite.scaleX *= scaleX
    }
    if (scaleY !== undefined) {
      this.sprite.scaleY *= scaleY
    }
  }

  update() {
    if (!this.sprite.body.embedded) {
      this.scene.hoverText.hide()
    }
  }

  destroy() {
    this.sprite.destroy()
    this.playerOverlap.destroy()
  }
}
