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
    this.hullSprite.setDepth(this.scene.player.depth - 1)

    this.addCollider({ x, y }, { width: 264, height: 231 }, { x: -37, y: 80 })
    this.addCollider({ x, y }, { width: 100, height: 251 }, { x: -140, y: 50 })
    this.addCollider({ x, y }, { width: 100, height: 251 }, { x: 205, y: 50 })
    this.setupWalls()

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

  setupWalls() {
    // Walls for the middle part of the ship
    this.addWall(this.hullSprite.x + 80, this.hullSprite.y + 70, 190, 2)
    this.addWall(this.hullSprite.x + 80, this.hullSprite.y + 235, 190, 2)
    this.addWall(this.hullSprite.x - 55, this.hullSprite.y + 125, 2, 100)
    this.addWall(this.hullSprite.x + 210, this.hullSprite.y + 125, 2, 100)

    // Walls for the stairs
    this.addWall(this.hullSprite.x - 25, this.hullSprite.y + 55, 20, 2)
    this.addWall(this.hullSprite.x - 45, this.hullSprite.y + 40, 20, 2)
    this.addWall(this.hullSprite.x - 45, this.hullSprite.y + 100, 20, 2)

    this.addWall(this.hullSprite.x + 182, this.hullSprite.y + 55, 20, 2)
    this.addWall(this.hullSprite.x + 205, this.hullSprite.y + 40, 20, 2)
    this.addWall(this.hullSprite.x + 200, this.hullSprite.y + 100, 20, 2)

    // this.addWall(this.hullSprite.x - 30, this.hullSprite.y + 190, 10, 2)
    this.addWall(this.hullSprite.x - 40, this.hullSprite.y + 180, 20, 2)
    this.addWall(this.hullSprite.x - 15, this.hullSprite.y + 235, 20, 2)
    this.addWall(this.hullSprite.x - 45, this.hullSprite.y + 220, 20, 2)

    this.addWall(this.hullSprite.x + 195, this.hullSprite.y + 180, 20, 2)
    this.addWall(this.hullSprite.x + 175, this.hullSprite.y + 235, 20, 2)
    this.addWall(this.hullSprite.x + 200, this.hullSprite.y + 220, 20, 2)

    // Walls for the upper decks
    this.addWall(this.hullSprite.x - 90, this.hullSprite.y + 205, 80, 2)
    this.addWall(this.hullSprite.x - 150, this.hullSprite.y + 190, 20, 2)
    this.addWall(this.hullSprite.x - 165, this.hullSprite.y + 180, 20, 2)
    this.addWall(this.hullSprite.x - 175, this.hullSprite.y + 170, 20, 2)
    this.addWall(this.hullSprite.x - 185, this.hullSprite.y + 160, 20, 2)
    this.addWall(this.hullSprite.x - 195, this.hullSprite.y + 150, 20, 2)
    this.addWall(this.hullSprite.x - 200, this.hullSprite.y + 130, 2, 20)

    this.addWall(this.hullSprite.x - 90, this.hullSprite.y + 40, 80, 2)
    this.addWall(this.hullSprite.x - 150, this.hullSprite.y + 190, 20, 2)
    this.addWall(this.hullSprite.x - 165, this.hullSprite.y + 180, 20, 2)
    this.addWall(this.hullSprite.x - 175, this.hullSprite.y + 170, 20, 2)
    this.addWall(this.hullSprite.x - 185, this.hullSprite.y + 160, 20, 2)
    this.addWall(this.hullSprite.x - 195, this.hullSprite.y + 150, 20, 2)

    this.addWall(this.hullSprite.x - 150, this.hullSprite.y + 50, 20, 2)
    this.addWall(this.hullSprite.x - 165, this.hullSprite.y + 60, 20, 2)
    this.addWall(this.hullSprite.x - 175, this.hullSprite.y + 70, 20, 2)
    this.addWall(this.hullSprite.x - 185, this.hullSprite.y + 80, 20, 2)
    this.addWall(this.hullSprite.x - 195, this.hullSprite.y + 90, 20, 2)
    this.addWall(this.hullSprite.x - 205, this.hullSprite.y + 105, 20, 2)

    this.addWall(this.hullSprite.x + 250, this.hullSprite.y + 40, 65, 2)
    this.addWall(this.hullSprite.x + 250, this.hullSprite.y + 205, 65, 2)
    this.addWall(this.hullSprite.x + 270, this.hullSprite.y + 120, 2, 150)
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
