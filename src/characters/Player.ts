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
import { ItemTypes, ItemConfig } from '~/items/ItemConfig'
import { ItemFactory } from '~/items/ItemFactory'
import { ItemBox } from '~/ui/InventoryMenu'

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

export interface Equipment {
  weapon?: Weapon
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
  public static UNARMED_DAMAGE = 5

  public stateMachine: StateMachine
  public direction: Direction = Direction.DOWN
  public maxHealth: number = 100
  public currHealth: number = 100
  public iFrameDuration: number = 650
  public isHit: boolean = false
  public itemOnHover: Item | null = null
  public onEquipWeaponHandler: Function = () => {}
  public structureToBePlaced: any = null

  // Equipment and inventory
  public inventory: Inventory
  public equipment: Equipment

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
    this.equipment = {}
    this.configureKeyPresses()
  }

  getWeapon(): Weapon | undefined {
    return this.equipment.weapon
  }

  onCraft(craftableItem: ItemConfig) {
    const recipe = craftableItem.recipe
    if (recipe) {
      Object.keys(recipe).forEach((key: string) => {
        this.removeItem(key, recipe[key])
      })
      const item = ItemFactory.instance.createItem(craftableItem.name, this.x, this.y)
      if (item) {
        this.addItem(item)
        item.sprite.destroy()
      }
    }
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
        if (keycode.code === 'KeyR' && this.equipment.weapon) {
          this.equipment.weapon.toggleEquip()
          this.onEquipWeaponHandler()
        }

        // Maximize the inventory and bring up crafting menu if 'I' is pressed
        if (keycode.code === 'KeyI') {
          UIScene.instance.craftingMenu.updateCraftableItems(this.inventory)

          if (!UIScene.instance.craftingMenu.onCraft) {
            UIScene.instance.craftingMenu.setOnCraftCallback((craftableItem: ItemConfig) => {
              this.onCraft(craftableItem)
            })
          }
          UIScene.instance.inventoryMenu.toggleInventoryExpand()
          UIScene.instance.craftingMenu.toggleVisible()
        }

        if (keycode.code === 'KeyC') {
          UIScene.instance.equipMenu.toggleVisible()
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
      this.itemOnHover = null
      gameScene.pickupObjText.hide()
    }
    if (this.equipment.weapon) {
      this.equipment.weapon.show()
    }
  }

  handleItemClick(itemName: string) {
    const item = ItemFactory.instance.getItemType(itemName)
    if (item && item.stats) {
      // Handle if the double-clicked item was a weapon
      if (item.type === ItemTypes.weapon) {
        if (this.equipment.weapon) {
          const weaponName = this.equipment.weapon.name
          const weaponItem = ItemFactory.instance.createItem(weaponName, this.x, this.y)
          if (weaponItem) {
            this.addItem(weaponItem)
            weaponItem.destroy()
          }
          this.equipment.weapon.destroy()
          this.equipment.weapon = undefined
        }
        this.removeItem(item.name, 1)
        const weapon = new Weapon(this.scene, this, {
          texture: item.weaponImage as string,
          damage: item.stats.damage as number,
          attackRange: item.stats['attack range'] as number,
          name: item.name,
        })
        this.equipWeapon(weapon)
      }

      // Handle if the double-clicked item was a structure
      if (item.type === ItemTypes.structure) {
        this.structureToBePlaced = item
      }
    }
  }

  onUnequipItem(itemBox: ItemBox) {
    const weaponItem = ItemFactory.instance.createItem(itemBox.itemName, this.x, this.y)
    if (weaponItem) {
      this.addItem(weaponItem)
      weaponItem?.destroy()
    }
    const weapon = this.equipment.weapon
    this.equipment.weapon = undefined
    weapon?.destroy()
  }

  equipWeapon(weapon: Weapon) {
    this.equipment.weapon = weapon
    this.equipment.weapon.isEquipped = true
    this.onEquipWeaponHandler()

    const item = ItemFactory.instance.getItemType(weapon.name)
    if (item) {
      UIScene.instance.equipMenu.weaponBox.setItem(1, weapon.name, item.image as string)
      if (!UIScene.instance.equipMenu.onItemClick) {
        UIScene.instance.equipMenu.onItemClick = (itemBox: ItemBox) => {
          this.onUnequipItem(itemBox)
        }
      }
    }
  }

  setOnEquipWeaponHandler(cb: Function) {
    this.onEquipWeaponHandler = cb
  }

  addItem(item: Item) {
    if (!this.inventory[item.itemName]) {
      this.inventory[item.itemName] = {
        count: 0,
        texture: item.sprite.texture.key,
      }
    }
    this.inventory[item.itemName].count++
    UIScene.instance.inventoryMenu.updateInventoryMenu(
      this.inventory,
      (itemName: string, itemBox: ItemBox) => this.handleItemClick(itemName)
    )
    UIScene.instance.craftingMenu.updateCraftableItems(this.inventory)
  }

  removeItem(itemKey: string, quantity: number) {
    if (this.inventory[itemKey]) {
      this.inventory[itemKey].count -= quantity
      if (this.inventory[itemKey].count === 0) {
        delete this.inventory[itemKey]
      }
      UIScene.instance.inventoryMenu.updateInventoryMenu(
        this.inventory,
        (itemType: string, itemBox: ItemBox) => this.handleItemClick(itemType)
      )
      UIScene.instance.craftingMenu.updateCraftableItems(this.inventory)
    }
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
