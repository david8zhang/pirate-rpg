import { Direction } from '~/characters/Player'
import { Mob } from '~/mobs/Mob'
import { ShipUIScene } from '~/scenes/ShipUIScene'
import Game from '../scenes/Game'
import { Cannon } from './Cannon'
import { EnemyShip } from './EnemyShip'

export interface ShipConfig {
  defaultHealth: number
  name: string
  hullImages: {
    up: string
    down: string
    side: string
  }
  hullBodyConfig: {
    up: any
    down: any
    left: any
    right: any
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
  cannonConfig: {
    left: any[]
    right: any[]
    up: any[]
    down: any[]
  }
  centerOffset: {
    left: any
    right: any
    up: any
    down: any
  }
}

export class Ship {
  public hullSprite!: Phaser.Physics.Arcade.Sprite
  public wheelSprite!: Phaser.Physics.Arcade.Sprite
  public ladderSprite!: Phaser.Physics.Arcade.Sprite
  public sailsSprite!: Phaser.Physics.Arcade.Sprite
  public scene: Game
  public currDirection = Direction.RIGHT
  public wallImages: Phaser.Physics.Arcade.Image[] = []
  public hitboxImages: Phaser.Physics.Arcade.Image[] = []
  public wheelCollider!: Phaser.Physics.Arcade.Collider
  public shipConfig: ShipConfig
  public landDetectorImg!: Phaser.Physics.Arcade.Image
  public boardableShipDetectorImg?: Phaser.Physics.Arcade.Image
  public disembarkPoint: Phaser.Physics.Arcade.Image | null = null
  public embarkPoint: Phaser.Physics.Arcade.Image | null = null
  public cannons: Cannon[] = []
  public hullBodyConfig: any
  public wallColliders: Phaser.Physics.Arcade.Collider[] = []

  public isAnchored: boolean = true
  public canTakeWheel: boolean = false
  public canAnchor: boolean = false
  public canExitShip: boolean = false
  public canEnterShip: boolean = false
  public isFiringRightCannon: boolean = false
  public isFiringLeftCannon: boolean = false
  public health: number
  public maxHealth: number
  public moveSpeed: number = 200
  public passengers: any[] = []
  public boardableShip: Ship | null = null
  public boardableShipOverlap?: Phaser.Physics.Arcade.Collider
  public shipType: string

  constructor(
    scene: Game,
    shipConfig: ShipConfig,
    position: { x: number; y: number },
    currDirection: Direction = Direction.RIGHT
  ) {
    this.scene = scene
    const { x, y } = position
    const {
      hullImages,
      sailsImages,
      colliderConfig,
      hitboxConfig,
      wheelConfig,
      ladderConfig,
      cannonConfig,
      hullBodyConfig,
      name,
    } = shipConfig
    this.shipType = name
    this.hullBodyConfig = hullBodyConfig
    this.currDirection = currDirection

    // Setup the sprites and hitboxes
    this.setupSprites(x, y, hullImages, sailsImages)
    this.setupHitbox(hitboxConfig)
    this.setupWalls(colliderConfig)
    this.setupWheel(wheelConfig)
    this.setupLadder(ladderConfig)
    this.setupCannon(cannonConfig)

    this.shipConfig = shipConfig
    this.setupLandDetector(x, y)

    this.hullSprite.setData('ref', this)
    this.health = shipConfig.defaultHealth
    this.maxHealth = shipConfig.defaultHealth

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

    this.scene.input.keyboard.on('keydown', (keycode: any) => {
      if (keycode.code === 'KeyQ') {
        if (
          this === this.scene.player.ship &&
          !this.isFiringLeftCannon &&
          this.scene.player.isSteeringShip
        ) {
          this.isFiringLeftCannon = true
          const leftCannons = this.getCannons('left')
          leftCannons.forEach((cannon) => {
            cannon.fireCannon()
          })
          this.scene.time.delayedCall(300, () => {
            this.isFiringLeftCannon = false
          })
        }
      }
      if (keycode.code === 'KeyR') {
        if (
          this === this.scene.player.ship &&
          !this.isFiringRightCannon &&
          this.scene.player.isSteeringShip
        ) {
          this.isFiringRightCannon = true
          const rightCannons = this.getCannons('right')
          rightCannons.forEach((cannon) => {
            cannon.fireCannon()
          })
          this.scene.time.delayedCall(300, () => {
            this.isFiringRightCannon = false
          })
        }
      }
    })
  }

  fireAllCannons() {
    const allCannons = this.getCannons('right').concat(this.getCannons('left'))
    allCannons.forEach((cannon) => cannon.fireCannon())
  }

  addPassenger(mob: Mob) {
    this.passengers.push(mob)
    mob.sprite.setName('Transport')
  }

  fireCannon(direction: Direction) {
    if (direction === Direction.RIGHT) {
      const rightCannons = this.getCannons('right')
      rightCannons.forEach((cannon) => cannon.fireCannon())
    } else if (direction === Direction.LEFT) {
      const leftCannons = this.getCannons('left')
      leftCannons.forEach((cannon) => cannon.fireCannon())
    }
  }

  getCenterPoint() {
    const { centerOffset } = this.shipConfig
    const centerOffsetConfig = centerOffset[this.currDirection]
    return {
      x: this.hullSprite.x + centerOffsetConfig.x,
      y: this.hullSprite.y + centerOffsetConfig.y,
    }
  }

  takeDamage(damage: number) {
    this.health -= damage
    this.health = Math.max(this.health, 0)
    this.scene.cameras.main.shake(100, 0.005)
    if (this === this.scene.player.ship) {
      ShipUIScene.instance.shipHealthBar.setCurrHealth(this.health)
      ShipUIScene.instance.shipHealthBar.setMaxHealth(this.maxHealth)
    }
    if (this.health === 0) {
      this.destroy()
      if (this.scene.player.ship && this.scene.player.ship === this) {
        if (!this.isAnchored) {
          this.anchor()
        }
        this.playerExitShip()
        this.scene.player.ship = null
        this.scene.player.takeDamage(this.scene.player.currHealth)
      }
    }
  }

  getCannons(direction: 'left' | 'right'): Cannon[] {
    if (direction === 'left') {
      switch (this.currDirection) {
        case Direction.LEFT:
        case Direction.RIGHT:
          return this.cannons.filter((c) => {
            return c.direction === Direction.UP
          })
        case Direction.UP:
        case Direction.DOWN:
          return this.cannons.filter((c) => {
            return c.direction === Direction.LEFT
          })
      }
    } else {
      switch (this.currDirection) {
        case Direction.LEFT:
        case Direction.RIGHT:
          return this.cannons.filter((c) => {
            return c.direction === Direction.DOWN
          })
        case Direction.UP:
        case Direction.DOWN:
          return this.cannons.filter((c) => {
            return c.direction === Direction.RIGHT
          })
      }
    }
  }

  destroy() {
    this.hullSprite.destroy()
    this.sailsSprite.destroy()
    this.wheelSprite.destroy()
    this.landDetectorImg.destroy()
    this.wallImages.forEach((wallImg) => {
      wallImg.destroy()
    })
    if (this.boardableShipDetectorImg) {
      this.boardableShipDetectorImg.destroy()
      this.boardableShipOverlap?.destroy()
    }
    if (this.ladderSprite) {
      this.ladderSprite.destroy()
    }
    this.hitboxImages.forEach((hitboxImg) => {
      hitboxImg.destroy()
    })
    this.cannons.forEach((cannon) => {
      cannon.destroy()
    })
    this.passengers.forEach((p) => {
      p.die()
    })
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

  setupCannon(cannonConfig: any) {
    const config = cannonConfig[this.currDirection]
    if (this.cannons.length > 0) {
      this.cannons.forEach((c) => c.destroy())
      this.cannons = []
    }
    config.forEach((c, index) => {
      const xPos = this.hullSprite.x + c.x
      const yPos = this.hullSprite.y + c.y
      this.cannons[index] = new Cannon(
        this.scene,
        {
          ...c,
          x: xPos,
          y: yPos,
        },
        this
      )
    })
  }

  setVisible(isVisible: boolean) {
    this.sailsSprite.setVisible(isVisible)
    this.hullSprite.setVisible(isVisible)
    this.cannons.forEach((c) => {
      c.sprite.setVisible(isVisible)
    })
    if (this.ladderSprite) {
      this.ladderSprite.setVisible(isVisible)
    }
    this.wheelSprite.setVisible(isVisible)
  }

  setupBoardableShipDetector(x: number, y: number) {
    if (!this.boardableShipDetectorImg) {
      this.boardableShipDetectorImg = this.scene.physics.add.image(x, y, '').setVisible(false)
      this.scene.physics.world.enableBody(
        this.boardableShipDetectorImg,
        Phaser.Physics.Arcade.DYNAMIC_BODY
      )
      this.boardableShipOverlap = this.scene.physics.add.overlap(
        this.boardableShipDetectorImg,
        this.scene.ships,
        (obj1, obj2) => {
          const ship: Ship = obj2.getData('ref')
          const enemyShip = ship as EnemyShip
          if (ship !== this && !enemyShip.mobInControl && this.scene.player.ship === this) {
            this.boardableShip = ship
          }
        }
      )
    }
    const centerPoint = this.getCenterPoint()
    this.boardableShipDetectorImg.body.setSize(500, 500)
    this.boardableShipDetectorImg.x = centerPoint.x
    this.boardableShipDetectorImg.y = centerPoint.y
  }

  destroyBoardableShipDetector() {
    this.boardableShipDetectorImg?.destroy()
    this.boardableShipOverlap?.destroy()
    this.boardableShipDetectorImg = undefined
    this.boardableShipOverlap = undefined
  }

  setupLandDetector(x: number, y: number) {
    if (!this.landDetectorImg) {
      this.landDetectorImg = this.scene.physics.add.image(x, y, '').setVisible(false)
      this.scene.physics.world.enableBody(this.landDetectorImg, Phaser.Physics.Arcade.DYNAMIC_BODY)
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
      this.ladderSprite.setName('Transport')
      this.scene.physics.world.enableBody(this.ladderSprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
      this.scene.physics.add.overlap(this.ladderSprite, this.scene.player, () =>
        this.onPlayerLadderCollide()
      )
    } else {
      this.ladderSprite.setTexture(directionConfig.image)
      this.ladderSprite.setX(xPos)
      this.ladderSprite.setY(yPos)
    }
    this.ladderSprite.body.setSize(this.ladderSprite.width, this.ladderSprite.height)

    if (this.currDirection === Direction.RIGHT) {
      this.ladderSprite.scaleX = -1
      this.ladderSprite.body.offset.x = this.ladderSprite.width
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

  onPlayerLadderCollide() {
    if (this.scene.player.ship !== null) {
      this.disembarkPoint = this.ladderSprite
      this.canExitShip = true
    } else {
      this.embarkPoint = this.ladderSprite
      this.scene.player.enterableShip = this
    }
  }

  setupWheel(wheelConfig) {
    const directionConfig = wheelConfig[this.currDirection]
    const xPos = this.hullSprite.x + directionConfig.xOffset
    const yPos = this.hullSprite.y + directionConfig.yOffset
    if (!this.wheelSprite) {
      this.wheelSprite = this.scene.physics.add.sprite(xPos, yPos, directionConfig.image)
      this.wheelSprite.setName('Transport')
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
    if (
      this.scene.player.direction === this.currDirection &&
      this.isAnchored &&
      this.passengers.length === 0
    ) {
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

  setupSprites(x: number, y: number, hullImages: any, sailsImages: any) {
    const direction =
      this.currDirection === Direction.LEFT || this.currDirection === Direction.RIGHT
        ? 'side'
        : this.currDirection
    const hullImage = hullImages[direction]
    const sailsImage = sailsImages[direction]
    this.hullSprite = this.scene.physics.add.sprite(x, y, hullImage)
    this.sailsSprite = this.scene.physics.add.sprite(x, y, sailsImage)
    this.hullSprite.scaleX = this.currDirection === Direction.RIGHT ? -1 : 1
    this.sailsSprite.scaleX = this.currDirection === Direction.RIGHT ? -1 : 1
    this.configureHullBody()
    this.sailsSprite.setSize(1, 1)
    this.sailsSprite.setName('Transport')
    this.sailsSprite.setAlpha(0.5)
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

  adjustWallsBasedOnDirection(direction: Direction, colliderConfig: any) {
    const configs = colliderConfig[direction]
    this.wallImages.forEach((wallImage, index) => {
      const config = configs[index]
      if (!config) {
        wallImage.setActive(false)
        wallImage.debugShowBody = false
      } else {
        wallImage.setActive(true)
        wallImage.debugShowBody = true
        wallImage.body.setSize(config.width, config.height)
        wallImage.body.offset.x = config.xOffset
        wallImage.body.offset.y = config.yOffset
      }
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
    const playerWallCollider = this.scene.physics.add.collider(this.scene.player, image)
    const mobWallCollider = this.scene.physics.add.collider(this.scene.mobs, image)
    this.wallColliders.push(playerWallCollider)
    this.wallColliders.push(mobWallCollider)
    image.body.setSize(width, height)
    return image
  }

  update() {
    this.passengers = this.passengers.filter((p) => p.health > 0)
    if (!this.wheelSprite.body.embedded || this.currDirection !== this.scene.player.direction) {
      this.canTakeWheel = false
    }

    if (
      this.boardableShip &&
      !this.scene.physics.overlap(this.boardableShip.hullSprite, this.boardableShipDetectorImg)
    ) {
      this.boardableShip = null
    }

    if (!this.scene.physics.overlap(this.scene.player, this.ladderSprite)) {
      this.canExitShip = false
    }

    // update cannon
    this.cannons.forEach((c) => {
      c.update()
    })

    // If the player is steering the ship, handle movement
    if (this.scene.player.isSteeringShip) {
      this.handlePlayerMovement(this.scene.cursors)
    }

    // Show text to anchor if the ship is not moving
    if (this.canAnchor && !this.boardableShip) {
      this.scene.hoverText.showText(
        '(E) Anchor',
        this.scene.player.x - this.scene.player.width / 2,
        this.scene.player.y + this.scene.player.height / 2
      )
    }

    if (this.boardableShip) {
      this.scene.hoverText.showText(
        '(E) Board ship',
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
    this.updateSpriteDepths()
  }

  updateSpriteDepths() {
    this.passengers.forEach((p) => {
      const depth =
        this.scene.player.ship === this ? this.scene.player.depth : this.hullSprite.depth + 1
      p.sprite.setDepth(depth)
    })
    if (this.ladderSprite) this.ladderSprite.setDepth(this.hullSprite.depth + 1)
    this.wheelSprite.setDepth(this.hullSprite.depth + 1)
    this.cannons.forEach((cannon) => {
      cannon.sprite.setDepth(this.hullSprite.depth + 1)
    })
    this.sailsSprite.setDepth(this.cannons[0].sprite.depth + 1)
  }

  playerEnterShip() {
    this.sailsSprite.setAlpha(0.5)
    this.setupLandDetector(this.hullSprite.x, this.hullSprite.y)
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
        this.scene.player.y = this.ladderSprite.y - 50
        this.scene.player.x = this.ladderSprite.x
        break
    }
    this.embarkPoint = null
    this.canEnterShip = false
    this.scene.hoverText.hide()
  }

  playerExitShip() {
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
        this.scene.player.y = this.ladderSprite.y + 50
        this.scene.player.x = this.ladderSprite.x
        break
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
    this.scene.disableShipCamera()
    this.scene.cameras.main.stopFollow()
    this.scene.cameras.main.startFollow(this.scene.player, true)

    this.setupWalls(this.shipConfig.colliderConfig)
  }

  takeWheel() {
    ShipUIScene.instance.shipHealthBar.setCurrHealth(this.health)
    ShipUIScene.instance.shipHealthBar.setMaxHealth(this.maxHealth)
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
    this.scene.cameras.main.startFollow(this.hullSprite, true)
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

  public stop() {
    this.setAllVelocity(0, 0)
  }

  public moveShip(direction: Direction) {
    const { hullImages, sailsImages, wheelConfig, ladderConfig, cannonConfig, hitboxConfig } =
      this.shipConfig
    const speed = this.moveSpeed
    this.setupHitbox(hitboxConfig)
    switch (direction) {
      case Direction.UP:
        if (this.currDirection === Direction.UP && !this.canMove()) {
          this.stop()
          return
        }
        this.sailsSprite.setAlpha(1)
        this.currDirection = Direction.UP
        this.hullSprite.scaleX = 1
        this.sailsSprite.scaleX = 1
        this.hullSprite.setTexture(hullImages.up)
        this.sailsSprite.setTexture(sailsImages.up)
        this.configureHullBody()
        this.setAllVelocity(0, -speed)
        break
      case Direction.LEFT:
        if (this.currDirection === Direction.LEFT && !this.canMove()) {
          this.stop()
          return
        }
        this.sailsSprite.setAlpha(1)
        this.currDirection = Direction.LEFT
        this.hullSprite.setTexture(hullImages.side)
        this.sailsSprite.setTexture(sailsImages.side)
        this.hullSprite.scaleX = 1
        this.sailsSprite.scaleX = 1
        this.configureHullBody()
        this.setAllVelocity(-speed, 0)
        break
      case Direction.RIGHT:
        if (this.currDirection === Direction.RIGHT && !this.canMove()) {
          this.stop()
          return
        }
        this.sailsSprite.setAlpha(1)
        this.currDirection = Direction.RIGHT
        this.hullSprite.setTexture(hullImages.side)
        this.sailsSprite.setTexture(sailsImages.side)
        this.sailsSprite.scaleX = -1
        this.hullSprite.scaleX = -1
        this.wheelSprite.body.offset.x = this.wheelSprite.width
        this.configureHullBody()
        this.setAllVelocity(speed, 0)
        break
      case Direction.DOWN:
        if (this.currDirection === Direction.DOWN && !this.canMove()) {
          this.stop()
          return
        }
        this.sailsSprite.setAlpha(0.5)
        this.currDirection = Direction.DOWN
        this.hullSprite.scaleX = 1
        this.sailsSprite.scaleX = 1
        this.hullSprite.setTexture(hullImages.down)
        this.sailsSprite.setTexture(sailsImages.down)
        this.configureHullBody()
        this.setAllVelocity(0, speed)
        break
    }
    this.setupWheel(wheelConfig)
    this.setupLadder(ladderConfig)
    this.setupCannon(cannonConfig)
    this.setupLandDetector(this.hullSprite.x, this.hullSprite.y)
    this.setupBoardableShipDetector(this.hullSprite.x, this.hullSprite.y)
  }

  handlePlayerMovement(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown
    const player = this.scene.player

    if (this !== this.scene.player.ship) {
      return
    }

    if (!(leftDown || rightDown || upDown || downDown)) {
      this.canAnchor = true
      this.stop()
      return
    }
    this.canAnchor = false
    let moveDirection: Direction = Direction.LEFT
    if (leftDown) {
      moveDirection = Direction.LEFT
      player.scaleX = -1
      player.body.offset.x = 27
      player.direction = moveDirection
    }
    if (rightDown) {
      moveDirection = Direction.RIGHT
      player.scaleX = 1
      player.body.offset.x = 12
      player.direction = moveDirection
    }
    if (upDown) {
      moveDirection = Direction.UP
      player.direction = moveDirection
    }
    if (downDown) {
      moveDirection = Direction.DOWN
      player.direction = moveDirection
    }
    this.moveShip(moveDirection)
    this.setPlayerAtWheelPosition()
    player.anims.play(`player-idle-${player.getAnimDirection(player.direction)}`, true)
  }

  configureHullBody() {
    const config = this.hullBodyConfig[this.currDirection]
    this.hullSprite.body.setSize(
      this.hullSprite.width * config.width,
      this.hullSprite.height * config.height
    )
    this.hullSprite.body.offset.y = this.hullSprite.height * config.yOffset
    this.hullSprite.body.offset.x = this.hullSprite.width * config.xOffset
  }

  setCurrHealth(health: number) {
    this.health = health
    ShipUIScene.instance.shipHealthBar.setCurrHealth(this.health)
  }

  public destroyAllColliders() {
    if (this.wallImages.length > 0) {
      this.wallImages.forEach((wall) => {
        wall.destroy()
      })
      this.wallImages = []
    }
    if (this.wallColliders.length > 0) {
      this.wallColliders.forEach((collider) => {
        collider.destroy()
      })
      this.wallColliders = []
    }
  }

  setAllVelocity(xVelocity, yVelocity) {
    this.hullSprite.setVelocity(xVelocity, yVelocity)
    this.sailsSprite.setVelocity(xVelocity, yVelocity)
    this.wheelSprite.setVelocity(xVelocity, yVelocity)
    this.hitboxImages.forEach((hitboxImage) => {
      if (hitboxImage && hitboxImage.active) {
        hitboxImage.setVelocity(xVelocity, yVelocity)
      }
    })
  }
}
