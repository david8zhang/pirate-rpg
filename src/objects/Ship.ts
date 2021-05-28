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
}

export class Ship {
  public group: Phaser.GameObjects.Group
  public hullSprite: Phaser.GameObjects.Sprite
  // public sailsSprite: Phaser.GameObjects.Sprite
  public scene: Game

  constructor(scene: Game, shipConfig: ShipConfig, position: { x: number; y: number }) {
    this.scene = scene
    const { x, y } = position
    const { hullImages, sailsImages } = shipConfig
    this.hullSprite = this.scene.add.sprite(x, y, hullImages.side)
    this.group = this.scene.add.group()
    // this.sailsSprite = this.scene.physics.add.sprite(x, y, sailsImages.side)

    this.hullSprite.setName('Transport')
    // this.hullSprite.body.setSize(264, 231)
    // this.hullSprite.body.offset.y = this.hullSprite.height / 2 + 65
    // this.hullSprite.body.offset.x = this.hullSprite.width / 2 - 52
    this.hullSprite.setDepth(this.scene.player.depth - 1)

    this.addCollider({ x, y }, { width: 264, height: 231 }, { x: -37, y: 80 })
    this.addCollider({ x, y }, { width: 100, height: 251 }, { x: -140, y: 50 })
    this.addCollider({ x, y }, { width: 100, height: 251 }, { x: 205, y: 50 })

    this.group.add(this.hullSprite)
    this.addWall(this.hullSprite.x + 80, this.hullSprite.y + 80, 190, 2)
    this.addWall(this.hullSprite.x + 80, this.hullSprite.y + 235, 190, 2)
    this.addWall(this.hullSprite.x - 55, this.hullSprite.y + 125, 2, 100)
    this.addWall(this.hullSprite.x + 210, this.hullSprite.y + 125, 2, 100)
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
