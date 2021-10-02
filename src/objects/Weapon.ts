import { Constants } from '~/utils/Constants'
import Player, { Direction } from '../characters/Player'

export interface WeaponConfig {
  textureSet: {
    up: string
    down: string
    left: string
    right: string
  }
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
  public textureSet: any
  public attackRange: number
  public name: string
  public attackEffectSprite: Phaser.GameObjects.Sprite

  // Hitbox image
  public hitboxImage: Phaser.Physics.Arcade.Image
  public isAttacking: boolean = false

  constructor(scene: Phaser.Scene, player: Player, weaponConfig: WeaponConfig) {
    this.scene = scene
    this.player = player
    this.sprite = this.scene.add.sprite(player.x, player.y, '')
    this.attackEffectSprite = this.scene.add.sprite(player.x, player.y, '')
    this.attackEffectSprite.setVisible(false)
    this.attackEffectSprite.setName('Effect')
    this.attackEffectSprite.setDepth(1000)
    this.sprite.setVisible(false)
    this.sprite.setOrigin(0.5)
    this.sprite.setName('Weapon')
    this.textureSet = weaponConfig.textureSet
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
    this.textureSet = weaponConfig.textureSet
    this.damage = weaponConfig.damage
  }

  toggleEquip() {
    this.isEquipped = !this.isEquipped
  }

  destroy() {
    this.sprite.destroy()
    this.attackEffectSprite.destroy()
    this.hitboxImage.destroy()
  }

  show() {
    if (!this.isAttacking && this.isEquipped) {
      const handPosition = this.getPlayerHandPosition()
      const weaponDepth = this.getWeaponDepth()
      const rotationAngle = this.getWeaponRotationAngle()
      const scaleX = this.getWeaponScaleX()
      const scaleY = this.getWeaponScaleY()

      this.sprite.setX(handPosition.x)
      this.sprite.setY(handPosition.y)

      const currWeaponTexture = this.textureSet[this.player.direction]
      this.sprite.setTexture(currWeaponTexture)
      this.sprite.setAngle(rotationAngle)
      this.sprite.setDepth(weaponDepth)
      this.sprite.scaleY = scaleY
      this.sprite.scaleX = scaleX
    }
    this.sprite.setVisible(this.isEquipped)
  }

  hide() {
    this.sprite.setVisible(false)
  }

  public activateWeaponHitbox() {
    this.hitboxImage.body.enable = true
    switch (this.player.direction) {
      case Direction.LEFT: {
        this.hitboxImage.setSize(this.sprite.width + 10, this.player.height + 20)
        this.hitboxImage.setPosition(this.player.x - this.attackRange, this.player.y)
        break
      }
      case Direction.RIGHT: {
        this.hitboxImage.setSize(this.sprite.width + 10, this.player.height + 20)
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

  playAnimationFrames(frames: any[], frameIndex: number, onCompletedFn: Function) {
    if (frameIndex == frames.length) {
      this.scene.time.delayedCall(100, onCompletedFn)
      return
    }
    const frame = frames[frameIndex]
    this.scene.time.delayedCall(frame.time, () => {
      const xPos = this.player.x + frame.x
      const yPos = this.player.y + frame.y
      this.sprite.setAngle(frame.angle)
      this.sprite.setTexture(frame.texture)
      this.sprite.setPosition(xPos, yPos)
      if (frame.onShowFn) {
        frame.onShowFn()
      }
      this.playAnimationFrames(frames, frameIndex + 1, onCompletedFn)
    })
  }

  playAttackAnimation() {
    if (this.isAttacking) {
      return
    }
    this.isAttacking = true
    const sideTexture = this.textureSet[Direction.LEFT]
    const diagTexture = this.textureSet[Direction.DOWN]

    switch (this.player.direction) {
      case Direction.LEFT: {
        this.sprite.scaleY = 1
        this.sprite.scaleX = -1
        this.attackEffectSprite.scaleX = -1
        this.sprite.setAngle(0)
        this.sprite.x = this.player.x - 10
        this.sprite.y = this.player.y - 10
        const frames = [
          {
            texture: sideTexture,
            x: -10,
            y: -10,
            time: 0,
            angle: 0,
          },
          {
            texture: sideTexture,
            x: -15,
            y: -15,
            time: 75,
            angle: 0,
          },
          {
            texture: diagTexture,
            x: -10,
            y: -10,
            time: 75,
            angle: 0,
          },
          {
            texture: sideTexture,
            x: -10,
            y: 30,
            time: 75,
            angle: 180,
            onShowFn: () => {
              this.activateWeaponHitbox()
              this.attackEffectSprite.setVisible(true)
              this.attackEffectSprite.setTexture('slash-1')
              this.attackEffectSprite.setPosition(this.sprite.x - 15, this.sprite.y - 15)
            },
          },
          {
            texture: sideTexture,
            x: -10,
            y: 35,
            time: 75,
            angle: 180,
            onShowFn: () => {
              this.attackEffectSprite.setVisible(true)
              this.attackEffectSprite.setTexture('slash-2')
              this.attackEffectSprite.setPosition(this.sprite.x - 15, this.sprite.y - 15)
            },
          },
          {
            texture: sideTexture,
            x: -10,
            y: 35,
            time: 75,
            angle: 180,
            onShowFn: () => {
              this.attackEffectSprite.setVisible(false)
            },
          },
        ]
        this.playAnimationFrames(frames, 0, () => {
          this.isAttacking = false
          this.hitboxImage.body.enable = false
          this.attackEffectSprite.scaleX = 1
        })
        break
      }
      case Direction.RIGHT: {
        this.sprite.scaleX = 1
        const frames = [
          {
            texture: sideTexture,
            x: 10,
            y: -10,
            time: 0,
            angle: 0,
          },
          {
            texture: sideTexture,
            x: 15,
            y: -15,
            time: 75,
            angle: 0,
          },
          {
            texture: diagTexture,
            x: 10,
            y: -10,
            time: 75,
            angle: 0,
          },
          {
            texture: sideTexture,
            x: 10,
            y: 30,
            time: 75,
            angle: 180,
            onShowFn: () => {
              this.activateWeaponHitbox()
              this.attackEffectSprite.setVisible(true)
              this.attackEffectSprite.setTexture('slash-1')
              this.attackEffectSprite.setPosition(this.sprite.x + 15, this.sprite.y - 15)
            },
          },
          {
            texture: sideTexture,
            x: 10,
            y: 35,
            time: 75,
            angle: 180,
            onShowFn: () => {
              this.attackEffectSprite.setVisible(true)
              this.attackEffectSprite.setTexture('slash-2')
              this.attackEffectSprite.setPosition(this.sprite.x + 15, this.sprite.y - 15)
            },
          },
          {
            texture: sideTexture,
            x: 10,
            y: 35,
            time: 75,
            angle: 180,
            onShowFn: () => {
              this.attackEffectSprite.setVisible(false)
            },
          },
        ]
        this.playAnimationFrames(frames, 0, () => {
          this.isAttacking = false
          this.hitboxImage.body.enable = false
        })
        break
      }
      case Direction.DOWN: {
        this.attackEffectSprite.setAngle(90)
        const frames = [
          {
            texture: sideTexture,
            x: 20,
            y: 10,
            time: 0,
            angle: 90,
          },
          {
            texture: sideTexture,
            x: 30,
            y: 5,
            time: 75,
            angle: 90,
          },
          {
            texture: diagTexture,
            x: 20,
            y: 20,
            time: 75,
            angle: 90,
          },
          {
            texture: sideTexture,
            x: -30,
            y: 5,
            time: 75,
            angle: 270,
            onShowFn: () => {
              this.activateWeaponHitbox()
              this.sprite.scaleX = -1
              this.attackEffectSprite.setVisible(true)
              this.attackEffectSprite.setTexture('slash-1')
              this.attackEffectSprite.setPosition(this.sprite.x + 15, this.sprite.y + 15)
            },
          },
          {
            texture: sideTexture,
            x: -30,
            y: 5,
            time: 75,
            angle: 270,
            onShowFn: () => {
              this.attackEffectSprite.setVisible(true)
              this.attackEffectSprite.setTexture('slash-2')
              this.attackEffectSprite.setPosition(this.sprite.x + 15, this.sprite.y + 15)
            },
          },
          {
            texture: sideTexture,
            x: -30,
            y: 5,
            time: 75,
            angle: 270,
            onShowFn: () => {
              this.attackEffectSprite.setVisible(false)
              this.attackEffectSprite.setAngle(0)
            },
          },
        ]
        this.playAnimationFrames(frames, 0, () => {
          this.isAttacking = false
          this.hitboxImage.body.enable = false
          this.attackEffectSprite.setAngle(0)
        })
        break
      }
      case Direction.UP: {
        this.attackEffectSprite.scaleY = -1
        this.attackEffectSprite.scaleX = -1
        this.attackEffectSprite.setAngle(90)
        this.sprite.scaleX = 1
        const frames = [
          {
            texture: sideTexture,
            x: -30,
            y: 5,
            time: 0,
            angle: 270,
          },
          {
            texture: sideTexture,
            x: -35,
            y: 10,
            time: 75,
            angle: 270,
          },
          {
            texture: diagTexture,
            x: -20,
            y: 5,
            time: 75,
            angle: 270,
          },
          {
            texture: sideTexture,
            x: 30,
            y: 10,
            time: 75,
            angle: 90,
            onShowFn: () => {
              this.activateWeaponHitbox()
              this.attackEffectSprite.setVisible(true)
              this.attackEffectSprite.setTexture('slash-1')
              this.attackEffectSprite.setPosition(this.sprite.x - 30, this.sprite.y - 30)
            },
          },
          {
            texture: sideTexture,
            x: 30,
            y: 10,
            time: 75,
            angle: 90,
            onShowFn: () => {
              this.attackEffectSprite.setVisible(true)
              this.attackEffectSprite.setTexture('slash-2')
              this.attackEffectSprite.setPosition(this.sprite.x - 30, this.sprite.y - 30)
            },
          },
          {
            texture: sideTexture,
            x: 20,
            y: 10,
            time: 75,
            angle: 90,
            onShowFn: () => {
              this.attackEffectSprite.setVisible(false)
              this.attackEffectSprite.setAngle(0)
              this.attackEffectSprite.scaleX = 1
              this.attackEffectSprite.scaleY = 1
            },
          },
        ]
        this.playAnimationFrames(frames, 0, () => {
          this.isAttacking = false
          this.hitboxImage.body.enable = false
        })
        break
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

  getWeaponScaleX() {
    if (this.player.direction === Direction.UP) {
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
        return 0
    }
  }

  // Refactor this
  getPlayerHandPosition() {
    const currAnimFrame = this.player.anims.currentFrame
    switch (this.player.direction) {
      case Direction.UP: {
        switch (currAnimFrame.textureFrame) {
          case '20.png': {
            return { x: this.player.x - 5, y: this.player.y - 1 }
          }
          case '22.png': {
            return { x: this.player.x - 5, y: this.player.y + 1 }
          }
          default:
            return { x: this.player.x - 5, y: this.player.y }
        }
      }
      case Direction.DOWN: {
        switch (currAnimFrame.textureFrame) {
          case '6.png': {
            return { x: this.player.x + 5, y: this.player.y - 1 }
          }
          case '7.png': {
            return { x: this.player.x + 5, y: this.player.y + 1 }
          }
          default:
            return { x: this.player.x + 5, y: this.player.y }
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
