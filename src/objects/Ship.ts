import { Direction } from '~/characters/Player'
import Game from '../scenes/Game'

export interface ShipConfig {
  hullImages: {
    up: string
    down: string
    side: string
  }
  sailsImages: {
    up: string
    down: string
    side: string
  }
  colliderConfig: {
    left: any[]
    right: any[]
    up: any[]
    down: any[]
  }
  hitboxConfig: {
    left: any[]
    right: any[]
    up: any[]
    down: any[]
  }
}

export class Ship {
  public group: Phaser.GameObjects.Group
  public hullSprite!: Phaser.GameObjects.Sprite
  public sailsSprite!: Phaser.GameObjects.Sprite
  public scene: Game
  public currDirection = Direction.LEFT
  public wallImages: Phaser.Physics.Arcade.Image[] = []
  public hitboxImages: Phaser.Physics.Arcade.Image[] = []
  public isAnchored: boolean = true

  constructor(scene: Game, shipConfig: ShipConfig, position: { x: number; y: number }) {
    this.scene = scene
    const { x, y } = position
    const { hullImages, sailsImages, colliderConfig, hitboxConfig } = shipConfig
    this.group = this.scene.add.group()

    this.setupSprites(x, y, hullImages, sailsImages, this.group)
    this.setupHitbox(hitboxConfig)
    this.setupWalls(colliderConfig)

    this.scene.input.on(
      'pointerdown',
      function (pointer) {
        if (pointer.leftButtonDown()) {
          console.log('X:', Math.round(pointer.worldX - x))
          console.log('Y:', Math.round(pointer.worldY - y))
        }
      },
      this
    )
  }
  setupSprites(
    x: number,
    y: number,
    hullImages: any,
    sailsImages: any,
    group: Phaser.GameObjects.Group
  ) {
    const direction =
      this.currDirection === Direction.LEFT || this.currDirection === Direction.RIGHT
        ? 'side'
        : this.currDirection
    const hullImage = hullImages[direction]
    const sailsImage = sailsImages[direction]
    this.hullSprite = this.scene.add.sprite(x, y, hullImage)
    this.sailsSprite = this.scene.add.sprite(x, y, sailsImage)

    if (this.isAnchored) {
      this.sailsSprite.setAlpha(0.5)
    }

    this.hullSprite.setName('Transport')
    this.hullSprite.setDepth(this.scene.player.depth - 1)

    this.hullSprite.scaleX = this.currDirection === Direction.RIGHT ? -1 : 1
    this.sailsSprite.scaleX = this.currDirection === Direction.RIGHT ? -1 : 1

    group.add(this.hullSprite)
    group.add(this.sailsSprite)
  }

  setupHitbox(hitboxConfig: any) {
    const configs = hitboxConfig[this.currDirection]
    configs.forEach((hitbox) => {
      const hitboxImg = this.addCollider(
        { x: this.hullSprite.x, y: this.hullSprite.y },
        { width: hitbox.width, height: hitbox.height },
        { x: hitbox.xOffset, y: hitbox.yOffset }
      )
      this.hitboxImages.push(hitboxImg)
    })
  }

  setupWalls(colliderConfig: any) {
    const configs = colliderConfig[this.currDirection]
    configs.forEach((wall) => {
      const wallImg = this.addWall(
        this.hullSprite.x + wall.xOffset,
        this.hullSprite.y + wall.yOffset,
        wall.width,
        wall.height
      )
      this.wallImages.push(wallImg)
    })
  }

  addCollider(
    position: { x: number; y: number },
    size: { width: number; height: number },
    offset: { x: number; y: number }
  ): Phaser.Physics.Arcade.Image {
    const image = this.scene.physics.add.image(position.x, position.y, '').setVisible(false)
    this.scene.physics.world.enableBody(image, Phaser.Physics.Arcade.DYNAMIC_BODY)
    image.body.setSize(size.width, size.height)
    image.body.offset.x = offset.x
    image.body.offset.y = offset.y
    image.body.debugBodyColor = 0x00ff00
    return image
  }

  addWall(x: number, y: number, width: number, height: number): Phaser.Physics.Arcade.Image {
    const image = this.scene.physics.add.image(x, y, '').setVisible(false).setImmovable(true)
    this.scene.physics.world.enableBody(image, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.scene.physics.add.collider(this.scene.player, image)
    image.body.setSize(width, height)
    return image
  }
}
