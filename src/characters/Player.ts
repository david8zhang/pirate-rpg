import Phaser from 'phaser'
import { AttackState } from './states/AttackState'
import { IdleState } from './states/IdleState'
import { MoveState } from './states/MoveState'
import Game from '../scenes/Game'
import { StateMachine } from '../lib/StateMachine'
import UIScene from '../scenes/GameUIScene'
import { Item } from '../objects/Item'
import { UINumber } from '../ui/UINumber'
import { Weapon } from '../objects/Weapon'
import { ItemTypes, ItemConfig } from '../objects/ItemConfig'
import { ItemFactory } from '../objects/ItemFactory'
import { ItemBox } from '../ui/InventoryMenu'
import { Structure } from '../objects/Structure'
import { Placeable, PlaceableType } from '../objects/Placeable'
import { Ship } from '~/objects/Ship'

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
  public static UNARMED_DAMAGE = 100

  public stateMachine: StateMachine
  public direction: Direction = Direction.DOWN
  public maxHealth: number = 100
  public currHealth: number = 100
  public iFrameDuration: number = 500
  public isHit: boolean = false
  public itemOnHover: Item | null = null
  public onEquipWeaponHandler: Function = () => {}
  public isSubmerged: boolean = false

  // Structures
  public structureToBePlaced: Placeable | null = null
  public structureToEnter!: Structure | null
  public structureColliders: Phaser.Physics.Arcade.Collider[] = []

  // Ships
  public ship: Ship | null = null
  public isSteeringShip: boolean = false
  public enterableShip: Ship | null = null

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

  canMove() {
    if (this.ship) {
      return this.ship.isAnchored
    }
    if (this.equipment.weapon) {
      return !this.equipment.weapon.isAttacking
    }
    return true
  }

  configureKeyPresses() {
    const gameScene = this.scene as Game
    this.scene.input.keyboard.on(
      'keydown',
      (keycode: any) => {
        // Pick up items that user is hovering over
        if (keycode.code === 'KeyE') {
          if (this.itemOnHover) {
            this.addItem(this.itemOnHover)
            ;(this.scene as Game).removeItem(this.itemOnHover)
            this.itemOnHover.sprite.destroy()
            this.itemOnHover = null
          }

          // Enter a structure
          if (this.structureToEnter) {
            this.structureToEnter.enterStructure()
          }

          // Take the wheel of the ship, enabling it to be moved around like a boat, or let go of the wheel, allowing
          // player to walk around it freely
          if (this.ship) {
            if (this.ship.canTakeWheel && this.ship.isAnchored) {
              this.ship.takeWheel()
              this.isSteeringShip = true
            } else if (this.ship.boardableShip) {
              this.ship.anchor()
              this.ship.playerExitShip()
              this.isSteeringShip = false
              const boardableShip = this.ship.boardableShip
              this.ship.destroyBoardableShipDetector()
              this.ship = boardableShip
              this.ship.playerEnterShip()
            } else if (this.ship.canAnchor) {
              this.ship.anchor()
              this.isSteeringShip = false
            } else if (this.ship.canExitShip) {
              this.setName('')
              this.ship.playerExitShip()
              this.ship = null
              if (this.getIsSubmerged()) {
                this.anims.play(`player-swim-${this.getAnimDirection(this.direction)}`)
              }
            }
          }

          if (this.enterableShip) {
            this.ship = this.enterableShip
            this.enterableShip = null
            this.enterShip(this.ship)
          }
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

        // Show currently equipped weapons
        if (keycode.code === 'KeyC') {
          UIScene.instance.equipMenu.toggleVisible()
        }
      },
      this
    )
  }

  enterShip(ship: Ship) {
    if (ship) {
      ship.playerEnterShip()
      this.setName('Transport')
      this.anims.play(`player-idle-${this.getAnimDirection(this.direction)}`)
    }
  }

  getCurrState(): string {
    return this.stateMachine.getState()
  }

  canAttack(): boolean {
    if (this.equipment.weapon) {
      return !this.equipment.weapon.isAttacking
    }
    return true
  }

  setCurrHealth(health: number) {
    this.currHealth = health
    const interval = setInterval(() => {
      if (UIScene.instance) {
        UIScene.instance.playerHealth.setCurrHealth(this.currHealth)
        clearInterval(interval)
      }
    }, 100)
  }

  respawn(x: number, y: number) {
    this.currHealth = this.maxHealth
    UIScene.instance.playerHealth.setCurrHealth(this.currHealth)

    this.setPosition(x, y)
    this.setActive(true)
    this.setVisible(true)
    this.anims.play(`player-idle-${this.getAnimDirection(this.direction)}`)
    this.body.enable = true
    UIScene.instance.hideGameOver()
  }

  public get isDead() {
    return this.currHealth <= 0
  }

  placeStructure() {
    if (this.structureToBePlaced) {
      const didPlaceStructure = this.structureToBePlaced.placeItem(PlaceableType.structure)
      if (didPlaceStructure) {
        this.structureToBePlaced = null
      }
    }
  }

  takeDamage(damage: number) {
    this.currHealth -= damage
    this.setTint(0xff0000)
    this.scene.time.delayedCall(200, () => {
      this.setTint(0xffffff)
    })
    UINumber.createNumber(`-${damage}`, this.scene, this.x, this.y)
    UIScene.instance.playerHealth.takeDamage(damage)
  }

  setStructureToEnter(structure: Structure) {
    this.structureToEnter = structure
  }

  resetEnterables() {
    this.structureToEnter = null
    this.enterableShip = null
  }

  die() {
    UIScene.instance.showGameOver()
    this.setActive(false)
    this.setVisible(false)
    this.body.enable = false
    this.setName('')
  }

  public getIsSubmerged() {
    let isOceanTile = false
    const gameScene = this.scene as Game
    gameScene.getAllTileLayers().forEach((tileMap) => {
      const check = tileMap.getTileAtWorldXY(this.x, this.y)
      if (check && check.layer.name === 'Ocean') {
        isOceanTile = true
      }
    })
    return isOceanTile && !this.ship
  }

  update() {
    if (this.ship) {
      this.setDepth(this.ship.hullSprite.depth + 5)
    }
    if (this.currHealth <= 0 && this.active) {
      this.die()
      return
    }
    this.isSubmerged = this.getIsSubmerged()

    if (this.structureToBePlaced) {
      this.structureToBePlaced.showPreview()
    }
    this.stateMachine.step()
    const gameScene = this.scene as Game
    if (!this.body.embedded) {
      this.itemOnHover = null
      gameScene.hoverText.hide()
      this.resetEnterables()
    }
    if (this.equipment.weapon) {
      this.equipment.weapon.show()
    }
  }

  dropItem(itemName: string) {
    this.removeItem(itemName, 1)
    const item = ItemFactory.instance.createItem(itemName, this.x, this.y)
    if (item) {
      item.dropLength = 50
      item.drop()
      ;(this.scene as Game).addItem(item)
    }
  }

  handleItemClick(itemName: string) {
    const item = ItemFactory.instance.getItemType(itemName)
    if (item) {
      // Handle if the double-clicked item was a weapon
      if (item.type === ItemTypes.weapon && item.stats) {
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
          textureSet: item.inWorldImageSet,
          damage: item.stats.damage as number,
          attackRange: item.stats['attack range'] as number,
          name: item.name,
        })
        this.equipWeapon(weapon)
      }

      // Handle if the double-clicked item was a structure
      if (item.type === ItemTypes.structure) {
        if (!this.structureToBePlaced) {
          this.structureToBePlaced = new Placeable(this.scene as Game, item, ['Grass', 'Sand'])
          this.structureToBePlaced.setShowPreview(true)
        } else {
          this.structureToBePlaced?.setShowPreview(false)
          this.structureToBePlaced?.destroy()
          this.structureToBePlaced = null
        }
      }

      // Handle if the double clicked item was a consumable
      if (item.type === ItemTypes.consumable) {
        this.removeItem(item.name, 1)
        const { effects } = item
        UINumber.createNumber(`+${effects.health}`, this.scene, this.x, this.y, 'green')
        if (effects.health) {
          this.setCurrHealth(Math.min(this.currHealth + effects.health, this.maxHealth))
        }
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

  setEquipment(equipment: {
    weapon: {
      name: string
      isEquipped: boolean
    }
  }) {
    if (equipment.weapon) {
      const { name, isEquipped } = equipment.weapon
      const item = ItemFactory.instance.getItemType(name)
      if (item) {
        const weapon = new Weapon(this.scene, this, {
          textureSet: item.inWorldImageSet,
          damage: item.stats.damage as number,
          attackRange: item.stats['attack range'] as number,
          name: item.name,
        })
        const interval = setInterval(() => {
          if (UIScene.instance.equipMenu) {
            this.equipWeapon(weapon)
            if (!isEquipped) {
              this.getWeapon()?.toggleEquip()
            }
            clearInterval(interval)
          }
        }, 100)
      }
    }
  }

  setInventory(inventory: Inventory) {
    this.inventory = inventory
    const interval = setInterval(() => {
      if (UIScene.instance.inventoryMenu) {
        UIScene.instance.inventoryMenu.updateInventoryMenu(
          this.inventory,
          (itemName: string, itemBox) => this.handleItemClick(itemName)
        )
        UIScene.instance.craftingMenu.updateCraftableItems(this.inventory)
        clearInterval(interval)
      }
    }, 100)
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
    ;(sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true)
    ;(sprite.body as Phaser.Physics.Arcade.Body).onWorldBounds = true
    sprite.body.offset.y = 22
    return sprite
  }
)
