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
  wheelConfig: {
    left: any
    right: any
    up: any
    down: any
  }
  ladderConfig: {
    left: any
    right: any
    up: any
    down: any
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
  public hullSprite!: Phaser.Physics.Arcade.Sprite
  public wheelSprite!: Phaser.Physics.Arcade.Sprite
  public ladderSprite!: Phaser.Physics.Arcade.Sprite
  public sailsSprite!: Phaser.Physics.Arcade.Sprite
  public scene: Game
  public currDirection = Direction.LEFT
  public wallImages: Phaser.Physics.Arcade.Image[] = []
  public hitboxImages: Phaser.Physics.Arcade.Image[] = []
  public wheelCollider!: Phaser.Physics.Arcade.Collider
  public shipConfig: ShipConfig
  public landDetectorImg!: Phaser.Physics.Arcade.Image
  public disembarkPoint: Phaser.Physics.Arcade.Image | null = null
  public embarkPoint: Phaser.Physics.Arcade.Image | null = null

  public isAnchored: boolean = true
  public canTakeWheel: boolean = false
  public canAnchor: boolean = false
  public canExitShip: boolean = false
  public canEnterShip: boolean = false

  constructor(scene: Game, shipConfig: ShipConfig, position: { x: number; y: number }) {
    this.scene = scene
    const { x, y } = position
    const { hullImages, sailsImages, colliderConfig, hitboxConfig, wheelConfig, ladderConfig } =
      shipConfig
    this.group = this.scene.add.group()

    // Setup the sprites and hitboxes
    this.setupSprites(x, y, hullImages, sailsImages, this.group)
    this.setupHitbox(hitboxConfig)
    this.setupWalls(colliderConfig)
    this.setupWheel(wheelConfig)
    this.setupLadder(ladderConfig)

    this.shipConfig = shipConfig
    this.setupLandDetector(x, y)

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

  canMove() {
    let moveable = true
    this.scene.getAllTileLayers().forEach((tileMap) => {
      const check = tileMap.getTileAtWorldXY(this.landDetectorImg.x, this.landDetectorImg.y)
      if (check && check.layer.name !== 'Ocean') {
        moveable = false
      }
    })
    return moveable
  }

  setupLandDetector(x: number, y: number) {
    if (!this.landDetectorImg) {
      this.landDetectorImg = this.scene.physics.add.image(x, y, '').setVisible(false)
      this.scene.physics.world.enableBody(this.landDetectorImg, Phaser.Physics.Arcade.DYNAMIC_BODY)
      this.scene.physics.add.overlap(this.landDetectorImg, this.scene.player, () => {
        if (this.scene.player.ship !== null) {
          this.disembarkPoint = this.landDetectorImg
          this.canExitShip = !this.canMove()
        } else {
          this.embarkPoint = this.landDetectorImg
          this.scene.player.enterableShip = this
        }
      })
    }
    this.landDetectorImg.body.setSize(100, 100)
    switch (this.currDirection) {
      case Direction.UP: {
        this.landDetectorImg.y = this.hullSprite.y - 100
        this.landDetectorImg.x = this.hullSprite.x
        break
      }
      case Direction.DOWN: {
        this.landDetectorImg.y = this.hullSprite.y + 300
        this.landDetectorImg.x = this.hullSprite.x
        break
      }
      case Direction.LEFT: {
        this.landDetectorImg.x = this.hullSprite.x - 200
        this.landDetectorImg.y = this.hullSprite.y + this.hullSprite.height / 4
        break
      }
      case Direction.RIGHT: {
        this.landDetectorImg.x = this.hullSprite.x + 200
        this.landDetectorImg.y = this.hullSprite.y + this.hullSprite.height / 4
        break
      }
    }
  }

  setupLadder(ladderConfig) {
    const directionConfig = ladderConfig[this.currDirection]
    const xPos = this.hullSprite.x + directionConfig.xOffset
    const yPos = this.hullSprite.y + directionConfig.yOffset
    if (!this.ladderSprite) {
      this.ladderSprite = this.scene.physics.add.sprite(xPos, yPos, directionConfig.image)
      this.scene.physics.world.enableBody(this.ladderSprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
      this.scene.physics.add.overlap(this.ladderSprite, this.scene.player, () => {
        if (this.scene.player.ship !== null) {
          this.disembarkPoint = this.ladderSprite
          this.canExitShip = true
        } else {
          this.embarkPoint = this.ladderSprite
          this.scene.player.enterableShip = this
        }
      })
    } else {
      this.ladderSprite.setTexture(directionConfig.image)
      this.ladderSprite.setX(xPos)
      this.ladderSprite.setY(yPos)
    }
    this.ladderSprite.body.setSize(this.ladderSprite.width * 2, this.ladderSprite.height * 1.5)

    if (this.currDirection === Direction.RIGHT) {
      this.ladderSprite.scaleX = -1
      this.ladderSprite.body.offset.x = this.ladderSprite.width * 1.5
    } else {
      this.ladderSprite.scaleX = 1
    }

    if (!this.wheelCollider) {
      this.wheelCollider = this.scene.physics.add.overlap(
        this.scene.player,
        this.wheelSprite,
        () => {
          this.onWheelOverlap()
        }
      )
    }
  }

  setupWheel(wheelConfig) {
    const directionConfig = wheelConfig[this.currDirection]
    const xPos = this.hullSprite.x + directionConfig.xOffset
    const yPos = this.hullSprite.y + directionConfig.yOffset
    if (!this.wheelSprite) {
      this.wheelSprite = this.scene.physics.add.sprite(xPos, yPos, directionConfig.image)
    } else {
      this.wheelSprite.setTexture(directionConfig.image)
      this.wheelSprite.setX(xPos)
      this.wheelSprite.setY(yPos)
    }
    this.wheelSprite.body.setSize(this.wheelSprite.width * 2, this.wheelSprite.height * 1.5)
    this.scene.physics.world.enableBody(this.wheelSprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    if (this.currDirection === Direction.RIGHT) {
      this.wheelSprite.scaleX = -1
      this.wheelSprite.body.offset.x = this.wheelSprite.width * 1.5
    } else {
      this.wheelSprite.scaleX = 1
    }
  }

  onWheelOverlap() {
    if (this.scene.player.direction === this.currDirection && this.isAnchored) {
      this.canTakeWheel = true
      this.scene.hoverText.showText(
        '(E) Take the wheel',
        this.scene.player.x - this.scene.player.width,
        this.scene.player.y + this.scene.player.height / 2
      )
    } else {
      this.scene.hoverText.hide()
    }
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
    this.hullSprite = this.scene.physics.add.sprite(x, y, hullImage)
    this.sailsSprite = this.scene.physics.add.sprite(x, y, sailsImage)

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
    if (this.hitboxImages.length > 0) {
      this.hitboxImages.forEach((img) => img.destroy())
    }
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
    if (this.wallImages.length > 0) {
      this.wallImages.forEach((img) => img.destroy())
    }
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

  update() {
    if (!this.wheelSprite.body.embedded || this.currDirection !== this.scene.player.direction) {
      this.canTakeWheel = false
    }
    if (!this.landDetectorImg.body.embedded && !this.ladderSprite.body.embedded) {
      this.canExitShip = false
      this.scene.player.enterableShip = null
    }

    // If the player is steering the ship, handle movement
    if (this.scene.player.isSteeringShip) {
      this.handleMovement(this.scene.cursors)
    }

    // Show text to anchor if the ship is not moving
    if (this.canAnchor) {
      this.scene.hoverText.showText(
        '(E) Anchor',
        this.scene.player.x - this.scene.player.width / 2,
        this.scene.player.y + this.scene.player.height / 2
      )
    }

    // If the player is at the front of the ship when it is touching land, allow the player to get off
    if (this.canExitShip) {
      this.scene.hoverText.showText(
        '(E) Disembark',
        this.scene.player.x - this.scene.player.width / 2,
        this.scene.player.y + this.scene.player.height / 2
      )
    }
    if (this.scene.player.enterableShip !== null) {
      this.scene.hoverText.showText(
        '(E) Board ship',
        this.scene.player.x - this.scene.player.width / 2,
        this.scene.player.y + this.scene.player.height / 2
      )
    }
  }

  playerEnterShip() {
    this.setupLandDetector(this.hullSprite.x, this.hullSprite.y)
    if (this.embarkPoint == this.landDetectorImg) {
      switch (this.currDirection) {
        case Direction.UP:
          this.scene.player.x = this.landDetectorImg.x
          this.scene.player.y = this.landDetectorImg.y + 80
          break
        case Direction.DOWN:
          this.scene.player.x = this.landDetectorImg.x
          this.scene.player.y = this.landDetectorImg.y - 80
          break
        case Direction.LEFT:
          this.scene.player.x = this.landDetectorImg.x + 100
          this.scene.player.y = this.landDetectorImg.y
          break
        case Direction.RIGHT:
          this.scene.player.x = this.landDetectorImg.x - 100
          this.scene.player.y = this.landDetectorImg.y
          break
      }
    } else if (this.embarkPoint === this.ladderSprite) {
      switch (this.currDirection) {
        case Direction.UP:
          this.scene.player.y = this.ladderSprite.y
          this.scene.player.x = this.ladderSprite.x - 20
          break
        case Direction.DOWN:
          this.scene.player.y = this.ladderSprite.y
          this.scene.player.x = this.ladderSprite.x + 20
          break
        case Direction.LEFT:
          this.scene.player.y = this.ladderSprite.y - 50
          this.scene.player.x = this.ladderSprite.x
          break
        case Direction.RIGHT:
          this.scene.player.y = this.ladderSprite.y + 50
          this.scene.player.x = this.ladderSprite.x
          break
      }
    }
    this.embarkPoint = null
    this.canEnterShip = false
    this.scene.hoverText.hide()
  }

  playerExitShip() {
    this.scene.player.ship = null
    if (this.disembarkPoint == this.landDetectorImg) {
      switch (this.currDirection) {
        case Direction.UP:
          this.scene.player.y = this.landDetectorImg.y - 100
          this.scene.player.x = this.landDetectorImg.x
          break
        case Direction.DOWN:
          this.scene.player.y = this.landDetectorImg.y + 100
          this.scene.player.x = this.landDetectorImg.x
          break
        case Direction.LEFT:
          this.scene.player.x = this.landDetectorImg.x - 100
          this.scene.player.y = this.landDetectorImg.y
          break
        case Direction.RIGHT:
          this.scene.player.x = this.landDetectorImg.x + 100
          this.scene.player.y = this.landDetectorImg.y
          break
      }
      this.landDetectorImg.x = this.scene.player.x
      this.landDetectorImg.y = this.scene.player.y
    } else if (this.disembarkPoint === this.ladderSprite) {
      switch (this.currDirection) {
        case Direction.UP:
          this.scene.player.y = this.ladderSprite.y
          this.scene.player.x = this.ladderSprite.x + 20
          break
        case Direction.DOWN:
          this.scene.player.y = this.ladderSprite.y
          this.scene.player.x = this.ladderSprite.x - 20
          break
        case Direction.LEFT:
          this.scene.player.y = this.ladderSprite.y + 50
          this.scene.player.x = this.ladderSprite.x
          break
        case Direction.RIGHT:
          this.scene.player.y = this.ladderSprite.y - 50
          this.scene.player.x = this.ladderSprite.x
          break
      }
    }
    this.disembarkPoint = null
    this.canExitShip = false
    this.scene.hoverText.hide()
  }

  anchor() {
    this.isAnchored = true
    this.canTakeWheel = true
    this.canAnchor = false
    this.scene.hoverText.hide()
    this.sailsSprite.setAlpha(0.5)

    const { colliderConfig, hitboxConfig } = this.shipConfig
    this.setupHitbox(hitboxConfig)
    this.setupWalls(colliderConfig)

    this.scene.disableShipCamera()
    this.scene.cameras.main.stopFollow()
    this.scene.cameras.main.startFollow(this.scene.player, true)
  }

  takeWheel() {
    this.isAnchored = false
    this.canTakeWheel = false
    this.scene.hoverText.hide()

    // Zoom the camera out to see the whole picture
    // this.scene.enableShipCamera()
    this.sailsSprite.setAlpha(1)
    this.destroyAllColliders()

    // Set player in position in front of wheel
    this.setPlayerAtWheelPosition()
    this.scene.player.setVelocity(0, 0)

    // Follow the ship instead of the main character
    this.scene.cameras.main.startFollow(this.hullSprite)
    this.scene.enableShipCamera()
  }

  setPlayerAtWheelPosition() {
    switch (this.currDirection) {
      case Direction.RIGHT: {
        this.scene.player.x = this.wheelSprite.x - this.wheelSprite.width
        this.scene.player.y = this.wheelSprite.y - 5
        break
      }
      case Direction.LEFT:
        this.scene.player.x = this.wheelSprite.x + this.wheelSprite.width
        this.scene.player.y = this.wheelSprite.y - 5
        break
      case Direction.UP: {
        this.scene.player.x = this.wheelSprite.x
        this.scene.player.y = this.wheelSprite.y + this.wheelSprite.height / 2
        break
      }
      case Direction.DOWN: {
        this.scene.player.x = this.wheelSprite.x
        this.scene.player.y = this.wheelSprite.y - this.wheelSprite.height
        break
      }
    }
  }

  handleMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown
    const player = this.scene.player
    const speed = 200

    const { hullImages, sailsImages, wheelConfig, ladderConfig } = this.shipConfig

    if (!(leftDown || rightDown || upDown || downDown)) {
      this.setAllVelocity(0, 0)
      this.canAnchor = true
      return
    }
    this.canAnchor = false
    if (leftDown) {
      if (this.currDirection === Direction.LEFT && !this.canMove()) {
        this.setAllVelocity(0, 0)
        return
      }
      player.scaleX = -1
      player.body.offset.x = 27
      player.direction = Direction.LEFT
      this.currDirection = Direction.LEFT
      this.hullSprite.setTexture(hullImages.side)
      this.sailsSprite.setTexture(sailsImages.side)
      this.hullSprite.scaleX = 1
      this.sailsSprite.scaleX = 1
      this.setAllVelocity(-speed, 0)
    }
    if (rightDown) {
      if (this.currDirection === Direction.RIGHT && !this.canMove()) {
        this.setAllVelocity(0, 0)
        return
      }
      player.scaleX = 1
      player.body.offset.x = 12
      player.direction = Direction.RIGHT
      this.currDirection = Direction.RIGHT
      this.hullSprite.setTexture(hullImages.side)
      this.sailsSprite.setTexture(sailsImages.side)
      this.sailsSprite.scaleX = -1
      this.hullSprite.scaleX = -1
      this.wheelSprite.body.offset.x = this.wheelSprite.width
      this.setAllVelocity(speed, 0)
    }
    if (upDown) {
      if (this.currDirection === Direction.UP && !this.canMove()) {
        this.setAllVelocity(0, 0)
        return
      }
      player.direction = Direction.UP
      this.currDirection = Direction.UP
      this.hullSprite.scaleX = 1
      this.sailsSprite.scaleX = 1
      this.hullSprite.setTexture(hullImages.up)
      this.sailsSprite.setTexture(sailsImages.up)
      this.setAllVelocity(0, -speed)
    }
    if (downDown) {
      if (this.currDirection === Direction.DOWN && !this.canMove()) {
        this.setAllVelocity(0, 0)
        return
      }
      player.direction = Direction.DOWN
      this.currDirection = Direction.DOWN
      this.hullSprite.scaleX = 1
      this.sailsSprite.scaleX = 1
      this.hullSprite.setTexture(hullImages.down)
      this.sailsSprite.setTexture(sailsImages.down)
      this.setAllVelocity(0, speed)
    }
    this.setupWheel(wheelConfig)
    this.setupLadder(ladderConfig)
    this.setPlayerAtWheelPosition()
    this.setupLandDetector(this.hullSprite.x, this.hullSprite.y)
    player.anims.play(`player-idle-${player.getAnimDirection(player.direction)}`, true)
  }

  destroyAllColliders() {
    if (this.wallImages.length > 0) {
      this.wallImages.forEach((wall) => {
        wall.destroy()
      })
    }
    if (this.hitboxImages.length > 0) {
      this.hitboxImages.forEach((img) => {
        img.destroy()
      })
    }
  }

  setAllVelocity(xVelocity, yVelocity) {
    this.hullSprite.setVelocity(xVelocity, yVelocity)
    this.sailsSprite.setVelocity(xVelocity, yVelocity)
    this.wheelSprite.setVelocity(xVelocity, yVelocity)
  }
}
