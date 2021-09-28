import { Direction } from '~/characters/Player'
import { SailingBehavior } from '~/lib/components/SailingBehavior'
import { Mob } from '~/mobs/Mob'
import { AnimationType } from '~/utils/Constants'
import Game from '../scenes/Game'
import { Ship, ShipConfig } from './Ship'

export class EnemyShip extends Ship {
  public mobInControl: Mob | null = null
  public moveSpeed: number = 150

  constructor(scene: Game, shipConfig: ShipConfig, position: { x: number; y: number }) {
    super(scene, shipConfig, position)
  }

  setupLadder() {
    return
  }

  canMoveInDirection(direction: Direction) {
    if (this.currDirection == direction && !this.canMove()) {
      return false
    }
    return true
  }

  setMobInControl(mobInControl: Mob) {
    this.mobInControl = mobInControl
    this.mobInControl.sprite.body.enable = false
    this.mobInControl.sprite.body.debugShowBody = false
    this.positionMobAtWheel()
    this.mobInControl.sprite.setName('Transport')
    this.mobInControl.sprite.setDepth(this.hullSprite.depth + 1)
  }

  takeDamage(damage: number) {
    this.health -= damage
    this.health = Math.max(this.health, 0)
    this.scene.cameras.main.shake(100, 0.005)
    if (this.mobInControl) {
      const behavior: SailingBehavior = this.mobInControl?.activeBehavior as SailingBehavior
      behavior.takeDamage()
    }

    if (this.health <= 0) {
      this.stop()
      if (this.mobInControl) {
        this.mobInControl.stopSailing()
      }
      const ship = this.convertToRegularShip()
      if (this.mobInControl) {
        const newMob = new Mob(
          this.scene,
          this.mobInControl?.sprite.x,
          this.mobInControl?.sprite.y,
          this.mobInControl.mobConfig,
          this.mobInControl?.spawner
        )
        ship.addPassenger(newMob)
        this.scene.addMob(newMob)
      }
      if (this.mobInControl) {
        ;(this.mobInControl as Mob).destroy()
        this.mobInControl = null
      }
    }
  }

  setupBoardableShipDetector() {
    return
  }

  convertToRegularShip() {
    const ship = new Ship(
      this.scene,
      this.shipConfig,
      { x: this.hullSprite.x, y: this.hullSprite.y },
      this.currDirection
    )
    this.scene.addShip(ship)
    this.destroy()
    return ship
  }

  update() {
    if (this.mobInControl) {
      this.mobInControl.sprite.setDepth(this.hullSprite.depth + 1)
    }
    super.update()
  }

  turn(direction: Direction) {
    const { hullImages, sailsImages, wheelConfig, ladderConfig, cannonConfig, hitboxConfig } =
      this.shipConfig
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
        break
    }
    this.setupWheel(wheelConfig)
    this.setupCannon(cannonConfig)
    this.positionMobAtWheel()
  }

  stop() {
    super.stop()
    if (this.wallImages.length === 0) {
      this.setupWalls(this.shipConfig.colliderConfig)
    }
  }

  onPlayerLadderCollide() {
    return
  }

  moveShip(direction: Direction) {
    this.destroyAllColliders()
    super.moveShip(direction)
    this.positionMobAtWheel()
  }

  positionMobAtWheel() {
    const distanceFromWheel = 20
    if (this.mobInControl) {
      switch (this.currDirection) {
        case Direction.UP:
          this.mobInControl.sprite.x = this.wheelSprite.x
          this.mobInControl.sprite.y = this.wheelSprite.y + distanceFromWheel
          break
        case Direction.DOWN:
          this.mobInControl.sprite.x = this.wheelSprite.x
          this.mobInControl.sprite.y = this.wheelSprite.y - distanceFromWheel
          break
        case Direction.LEFT:
          this.mobInControl.sprite.scaleX = 1
          this.mobInControl.sprite.x = this.wheelSprite.x + distanceFromWheel
          this.mobInControl.sprite.y = this.wheelSprite.y
          break
        case Direction.RIGHT:
          this.mobInControl.sprite.scaleX = -1
          this.mobInControl.sprite.x = this.wheelSprite.x - distanceFromWheel
          this.mobInControl.sprite.y = this.wheelSprite.y
          break
      }
      this.playMobAnimation()
    }
  }

  playMobAnimation() {
    if (this.mobInControl) {
      const sideAnim = this.mobInControl.animations[AnimationType.IDLE_SIDE]
      const upAnim = this.mobInControl.animations[AnimationType.IDLE_BACK]
      const downAnim = this.mobInControl.animations[AnimationType.IDLE_FRONT]
      switch (this.currDirection) {
        case Direction.LEFT:
        case Direction.RIGHT:
          if (this.mobInControl.sprite.anims.getName() !== sideAnim)
            this.mobInControl.sprite.anims.play(sideAnim)
          break
        case Direction.DOWN:
          if (this.mobInControl.sprite.anims.getName() !== downAnim)
            this.mobInControl.sprite.anims.play(downAnim)
          break
        case Direction.UP:
          if (this.mobInControl.sprite.anims.getName() !== upAnim)
            this.mobInControl.sprite.anims.play(upAnim)
          break
      }
    }
  }
}
