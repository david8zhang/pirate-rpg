import { Constants } from '~/utils/Constants'
import Player, { Direction } from '../characters/Player'

export interface WeaponConfig {
  texture: string
  damage: number
  attackRange: number
  name: string
}

export class Weapon {
  private scene: Phaser.Scene
  private player: Player
  public sprite: Phaser.GameObjects.Sprite
  public isEquipped: boolean = false
  public damage: number = 10
  public weaponTexture: string
  public attackRange: number
  public name: string

  // Hitbox image
  public hitboxImage: Phaser.Physics.Arcade.Image
  private isAttacking: boolean = false

  constructor(scene: Phaser.Scene, player: Player, weaponConfig: WeaponConfig) {
    this.scene = scene
    this.player = player
    this.sprite = this.scene.add.sprite(player.x, player.y, '')
    this.sprite.setVisible(false)
    this.sprite.setOrigin(0.5)
    this.sprite.setAngle(30)
    this.sprite.setName('Weapon')
    this.weaponTexture = weaponConfig.texture
    this.damage = weaponConfig.damage
    this.attackRange = weaponConfig.attackRange
    this.name = weaponConfig.name

    // Initialize weapon hitbox
    this.hitboxImage = this.scene.physics.add.image(this.sprite.x, this.sprite.y, '')
    this.hitboxImage.setSize(5, 5)
    this.hitboxImage.setVisible(false)
    this.scene.physics.world.enableBody(this.hitboxImage, Phaser.Physics.Arcade.DYNAMIC_BODY)
    this.hitboxImage.setPushable(false)
    this.hitboxImage.setDebugBodyColor(0xffff00)
  }

  setWeaponConfig(weaponConfig: WeaponConfig) {
    this.attackRange = weaponConfig.attackRange
    this.weaponTexture = weaponConfig.texture
    this.damage = weaponConfig.damage
  }

  toggleEquip() {
    this.isEquipped = !this.isEquipped
  }

  destroy() {
    this.sprite.destroy()
    this.hitboxImage.destroy()
  }

  show() {
    if (!this.isAttacking && this.isEquipped) {
      const handPosition = this.getPlayerHandPosition()
      const rotationAngle = this.getWeaponRotationAngle()
      const weaponDepth = this.getWeaponDepth()
      const scaleY = this.getWeaponScaleY()

      this.sprite.setX(handPosition.x)
      this.sprite.setY(handPosition.y)
      this.sprite.setTexture(this.weaponTexture)
      this.sprite.setAngle(rotationAngle)
      this.sprite.setDepth(weaponDepth)
      this.sprite.scaleY = scaleY
    }
    this.sprite.setVisible(this.isEquipped)
  }

  public activateWeaponHitbox() {
    this.hitboxImage.body.enable = true
    switch (this.player.direction) {
      case Direction.LEFT: {
        this.hitboxImage.setSize(this.sprite.width, this.player.height + 20)
        this.hitboxImage.setPosition(this.player.x - this.attackRange, this.player.y)
        break
      }
      case Direction.RIGHT: {
        this.hitboxImage.setSize(this.sprite.width, this.player.height + 20)
        this.hitboxImage.setPosition(this.player.x + this.attackRange, this.player.y)
        break
      }
      case Direction.UP: {
        this.hitboxImage.setSize(this.player.width + 20, this.sprite.height)
        this.hitboxImage.setPosition(this.player.x, this.player.y - this.attackRange)
        break
      }
      case Direction.DOWN: {
        this.hitboxImage.setSize(this.player.width + 20, this.sprite.height)
        this.hitboxImage.setPosition(this.player.x, this.player.y + this.attackRange)
        break
      }
    }
  }

  public tweenWeaponAttack() {
    this.activateWeaponHitbox()
    if (!this.isAttacking) {
      this.isAttacking = true
      this.sprite.setOrigin(0.5, 1)
      switch (this.player.direction) {
        case Direction.LEFT:
        case Direction.RIGHT: {
          const isLeft = this.player.direction === Direction.LEFT
          this.sprite.setY(this.player.y + 5)
          this.sprite.setX(isLeft ? this.player.x - 15 : this.player.x + 15)
          this.sprite.setScale(1.25)
          this.scene.tweens.add({
            targets: this.sprite,
            y: {
              from: this.player.y - 10,
              to: this.player.y + 10,
            },
            angle: {
              from: isLeft ? 20 : -20,
              to: isLeft ? -140 : 140,
            },
            duration: Constants.ATTACK_DURATION - 200,
            onComplete: () => {
              this.scene.time.delayedCall(100, () => {
                this.sprite.setScale(1)
                this.sprite.setOrigin(0.5)
                this.isAttacking = false
                this.hitboxImage.body.enable = false
              })
            },
          })
          break
        }
        case Direction.UP:
        case Direction.DOWN: {
          const isUp = this.player.direction === Direction.UP
          this.sprite.setY(isUp ? this.player.y - 10 : this.player.y + 10)
          this.sprite.setX(this.player.x + 10)
          this.sprite.setScale(1.25)
          this.sprite.setAngle(90)
          this.scene.tweens.add({
            targets: this.sprite,
            x: '-=20',
            angle: isUp ? '-=150' : '+=150',
            duration: Constants.ATTACK_DURATION - 200,
            onComplete: () => {
              this.scene.time.delayedCall(100, () => {
                this.sprite.setScale(1)
                this.sprite.setOrigin(0.5)
                this.isAttacking = false
                this.hitboxImage.body.enable = false
              })
            },
          })
          break
        }
      }
    }
  }

  getWeaponDepth() {
    if (this.player.direction === Direction.UP) {
      return this.player.depth - 1
    }
    return this.player.depth + 1
  }

  getWeaponScaleY() {
    if (this.player.direction === Direction.LEFT) {
      return -1
    }
    return 1
  }

  getWeaponRotationAngle() {
    const currAnimFrame = this.player.anims.currentFrame
    switch (this.player.direction) {
      case Direction.RIGHT: {
        switch (currAnimFrame.textureFrame) {
          case '1.png': {
            return 120
          }
          case '3.png': {
            return 60
          }
          default:
            return 90
        }
      }
      case Direction.LEFT: {
        switch (currAnimFrame.textureFrame) {
          case '1.png': {
            return 60
          }
          case '3.png': {
            return 120
          }
          default:
            return 90
        }
      }
      default:
        return 30
    }
  }

  // Refactor this
  getPlayerHandPosition() {
    const currAnimFrame = this.player.anims.currentFrame
    switch (this.player.direction) {
      case Direction.UP: {
        switch (currAnimFrame.textureFrame) {
          case '20.png': {
            return { x: this.player.x + 15, y: this.player.y - 1 }
          }
          case '22.png': {
            return { x: this.player.x + 15, y: this.player.y + 1 }
          }
          default:
            return { x: this.player.x + 15, y: this.player.y }
        }
      }
      case Direction.DOWN: {
        switch (currAnimFrame.textureFrame) {
          case '6.png': {
            return { x: this.player.x + 15, y: this.player.y - 1 }
          }
          case '7.png': {
            return { x: this.player.x + 15, y: this.player.y + 1 }
          }
          default:
            return { x: this.player.x + 15, y: this.player.y }
        }
      }
      case Direction.RIGHT: {
        let xPos = this.player.x
        let yPos = this.player.y
        switch (currAnimFrame.textureFrame) {
          case '1.png': {
            xPos = this.player.x + 10
            yPos = this.player.y + 20
            break
          }
          case '3.png': {
            xPos = this.player.x + 20
            yPos = this.player.y + 10
            break
          }
          default:
            yPos = this.player.y + 15
            xPos = this.player.x + 15
        }
        return { x: xPos, y: yPos }
      }
      case Direction.LEFT: {
        let xPos = this.player.x
        let yPos = this.player.y
        switch (currAnimFrame.textureFrame) {
          case '1.png': {
            xPos = this.player.x - 10
            yPos = this.player.y + 20
            break
          }
          case '3.png': {
            xPos = this.player.x - 20
            yPos = this.player.y + 10
            break
          }
          default:
            xPos = this.player.x - 15
            yPos = this.player.y + 15
        }
        return { x: xPos, y: yPos }
      }
    }
  }
}
