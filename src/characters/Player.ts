import Phaser from 'phaser'
import { AttackState } from './states/AttackState'
import { IdleState } from './states/IdleState'
import { MoveState } from './states/MoveState'
import Game from '../scenes/Game'
import { StateMachine } from '../lib/StateMachine'
import UIScene from '../scenes/UIScene'
import { Item } from '../items/Item'
import { DamageNumber } from '~/ui/DamageNumber'
import { Weapon } from '~/items/Weapon'

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      player(x: number, y: number, texture: string, frame?: string | number): Player
    }
  }
}

export enum Direction {
  DOWN = 'down',
  UP = 'up',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface Inventory {
  [key: string]: {
    count: number
    texture: string
  }
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  public static UNARMED_DAMAGE = 10

  public stateMachine: StateMachine
  public direction: Direction = Direction.DOWN
  public inventory: Inventory
  public maxHealth: number = 100
  public currHealth: number = 100
  public iFrameDuration: number = 650
  public isHit: boolean = false
  public itemOnHover: Item | null = null

  public weapon: Weapon

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture)
    this.anims.play('player-idle-down')
    this.stateMachine = new StateMachine(
      'idle',
      {
        idle: new IdleState(),
        attack: new AttackState(),
        move: new MoveState(),
      },
      [(scene as Game).cursors, this]
    )
    this.inventory = {}

    this.weapon = new Weapon(this.scene, this, {
      texture: 'axe',
      damage: 15,
      attackRange: 25,
    })

    this.configureKeyPresses()
  }

  configureKeyPresses() {
    this.scene.input.keyboard.on(
      'keydown',
      (keycode: any) => {
        // Pick up items that user is hovering over
        if (this.itemOnHover && keycode.code === 'KeyE') {
          this.itemOnHover.sprite.destroy()
          this.addItem(this.itemOnHover)
          this.itemOnHover = null
        }

        // Toggle weapon equip
        if (keycode.code === 'KeyR') {
          this.weapon.toggleEquip()
        }

        // Maximize the inventory and bring up crafting menu if 'I' is pressed
        if (keycode.code === 'KeyI') {
          UIScene.instance.inventoryMenu.toggleInventoryExpand()
          UIScene.instance.craftingMenu.toggleVisible()

          // Provide the crafting menu with the player's current inventory
          UIScene.instance.craftingMenu.updateCraftableItems(this.inventory)
        }
      },
      this
    )
  }

  getCurrState(): string {
    return this.stateMachine.getState()
  }

  takeDamage(damage: number) {
    this.currHealth -= damage
    this.setTint(0xff0000)
    this.scene.time.delayedCall(200, () => {
      this.setTint(0xffffff)
    })
    DamageNumber.createDamageNumber(damage, this.scene, this.x, this.y)
    UIScene.instance.playerHealth.takeDamage(damage)
  }

  update() {
    this.stateMachine.step()
    const gameScene = this.scene as Game
    if (!this.body.embedded) {
      gameScene.pickupObjText.hide()
    }
    this.weapon.show()
  }

  addItem(item: Item) {
    if (!this.inventory[item.itemType]) {
      this.inventory[item.itemType] = {
        count: 0,
        texture: item.sprite.texture.key,
      }
    }
    this.inventory[item.itemType].count++
    UIScene.instance.inventoryMenu.updateInventoryMenu(this.inventory)
    UIScene.instance.craftingMenu.updateCraftableItems(this.inventory)
  }

  getAnimDirection(dir: Direction) {
    if (dir === Direction.LEFT || dir === Direction.RIGHT) {
      return 'side'
    }
    return dir
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'player',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    const sprite = new Player(this.scene, x, y, texture, frame)
    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
    sprite.setPushable(false)
    sprite.body.setSize(sprite.width * 0.4, sprite.height * 0.4)
    sprite.body.offset.y = 22
    return sprite
  }
)
