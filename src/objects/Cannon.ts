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
  scaleX?: number
  scaleY?: number
  texture: string
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
    this.sprite.scaleX = config.scaleX ? config.scaleX : 1
    this.sprite.scaleY = config.scaleY ? config.scaleY : 1
    this.scene.physics.world.enableBody(
      this.sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    )
    if (config.body) {
      const { body } = config
      this.sprite.body.setSize(
        this.sprite.body.width * (body.width ? body.width : 1),
        this.sprite.body.height * (body.height ? body.height : 1)
      )
    }
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

  setTexture(texture: string) {
    this.sprite.setTexture(texture)
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
