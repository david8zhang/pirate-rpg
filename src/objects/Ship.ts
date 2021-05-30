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
  }
}

export class Ship {
  public group: Phaser.GameObjects.Group
  public hullSprite: Phaser.GameObjects.Sprite
  // public sailsSprite: Phaser.GameObjects.Sprite
  public scene: Game
  public currDirection = Direction.LEFT
  public wallImages: Phaser.Physics.Arcade.Image[] = []

  constructor(scene: Game, shipConfig: ShipConfig, position: { x: number; y: number }) {
    this.scene = scene
    const { x, y } = position
    const { hullImages, sailsImages, colliderConfig } = shipConfig
    this.hullSprite = this.scene.add.sprite(x, y, hullImages.side)
    this.group = this.scene.add.group()
    // this.sailsSprite = this.scene.physics.add.sprite(x, y, sailsImages.side)

    this.hullSprite.setName('Transport')
    this.hullSprite.setDepth(this.scene.player.depth - 1)

    this.addCollider({ x, y }, { width: 264, height: 231 }, { x: -37, y: 80 })
    this.addCollider({ x, y }, { width: 100, height: 251 }, { x: -140, y: 50 })
    this.addCollider({ x, y }, { width: 100, height: 251 }, { x: 205, y: 50 })
    this.setupWalls(colliderConfig)

    this.group.add(this.hullSprite)

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
