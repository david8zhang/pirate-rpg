import Phaser, { Physics } from 'phaser'
import { ALL_HARVESTABLES, Constants } from '../utils/Constants'
import '../characters/Player'
import '../mobs/GiantCrab'
import Player from '../characters/Player'
import { Crab } from '../mobs/Crab'
import { createCrabAnims } from '~/anims/CrabAnims'
import { createCharacterAnims } from '../anims/CharacterAnims'
import { createGiantCrabAnims } from '../anims/GiantCrabAnims'
import { Mob } from '../mobs/Mob'
import { Monkey } from '~/mobs/Monkey'
import { createmonkeyAnims } from '~/anims/MonkeyAnims'
import { Item } from '~/objects/Item'
import { HoverText } from '~/ui/HoverText'
import { ItemFactory } from '~/objects/ItemFactory'
import { Harvestable } from '~/objects/Harvestable'
import UIScene from './UIScene'
import { ParticleSpawner } from '~/lib/components/ParticleSpawner'
import { Structure } from '~/objects/Structure'

export default class Game extends Phaser.Scene {
  public player!: Player
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  public map!: Phaser.Tilemaps.Tilemap

  // Tilemap layers
  public oceanLayer!: Phaser.Tilemaps.TilemapLayer
  public grassLayer!: Phaser.Tilemaps.TilemapLayer
  public sandLayer!: Phaser.Tilemaps.TilemapLayer
  public objectsLayer!: Phaser.Tilemaps.TilemapLayer
  public structureInteriorLayer!: Phaser.Tilemaps.TilemapLayer
  public structureEntranceLayer!: Phaser.Tilemaps.TilemapLayer

  // colliders
  public playerHarvestableCollider!: Physics.Arcade.Collider
  public playerMobsCollider!: Physics.Arcade.Collider
  public playerItemsCollider!: Physics.Arcade.Collider

  // Mobs
  public mobsList: Mob[] = []
  public mobs!: Phaser.GameObjects.Group

  // Harvestables (Trees, bushes, etc.)
  public harvestableList: Harvestable[] = []
  public harvestables!: Phaser.GameObjects.Group

  // Items
  public items!: Phaser.GameObjects.Group
  public itemsOnGround: Item[] = []

  // Structures
  public structures!: Phaser.GameObjects.Group
  public structureLayer!: Phaser.Tilemaps.TilemapLayer
  public isInsideStructure: boolean = false
  public structureInteriorCollider!: Phaser.Physics.Arcade.Collider
  public structureEntranceCollider!: Phaser.Physics.Arcade.Collider

  // sprite names to ignore during depth-sorting
  public ignoreNames = ['InAir', 'UI', 'Weapon', 'Structure']

  // UI text
  public hoverText!: HoverText
  public isShipScale: boolean = false

  // Item Factory
  public itemFactory: ItemFactory
  public particleSpawner: ParticleSpawner

  constructor() {
    super('game')
    this.itemFactory = new ItemFactory(this)
    this.particleSpawner = new ParticleSpawner(this)
  }

  preload(): void {
    this.hoverText = new HoverText(this, 0, 0)
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create(): void {
    createCharacterAnims(this.anims)
    createGiantCrabAnims(this.anims)
    createCrabAnims(this.anims)
    createmonkeyAnims(this.anims)
    this.initTilemap()
    this.initPlayer()
    this.initPlants()
    this.initMobs()
    this.initItems()
  }

  initTilemap() {
    this.map = this.make.tilemap({ key: 'starter-island-2' })
    const tileset = this.map.addTilesetImage('beach-tiles', 'beach-tiles')
    this.oceanLayer = this.map.createLayer('Ocean', tileset).setName('Ocean')
    this.sandLayer = this.map.createLayer('Sand', tileset).setName('Sand')
    this.grassLayer = this.map.createLayer('Grass', tileset).setName('Grass')
    this.sandLayer.setCollisionByProperty({ collides: true })
    this.oceanLayer.setCollisionByProperty({ collides: true })
    this.grassLayer.setCollisionByProperty({ collides: true })
  }

  initPlayer() {
    this.player = this.add.player(256, 256, 'player')
    this.player.setDepth(1)
    this.player.setOnEquipWeaponHandler(() => {
      this.updateCollidersOnWeaponEquip()
    })
    this.physics.add.collider(this.player, this.oceanLayer)
    this.cameras.main.setBounds(0, 0, Constants.BG_WIDTH, Constants.BG_HEIGHT)
    this.cameras.main.startFollow(this.player, true)
  }

  initPlants() {
    // initialize plants
    const plantsLayer = this.map.getObjectLayer('Plants')
    const sortedByY = plantsLayer.objects.sort((a, b) => {
      return a.y! - b.y!
    })
    this.harvestables = this.physics.add.group({
      classType: Harvestable,
    })

    // Add other plant types
    const palmTreeConfig = ALL_HARVESTABLES[0]

    sortedByY.forEach((plantObj) => {
      const xPos = plantObj.x! + plantObj.width! * 0.5
      const yPos = plantObj.y! - plantObj.height! * 0.5
      const harvestable = new Harvestable(this, {
        ...palmTreeConfig,
        xPos,
        yPos,
      })
      this.harvestables.add(harvestable.sprite)
      this.harvestableList.push(harvestable)
    })

    this.playerHarvestableCollider = this.physics.add.collider(
      this.harvestables,
      this.player,
      (obj1, obj2) => {
        const harvestableRef: Harvestable = obj2.getData('ref')
        harvestableRef.handlePlantPlayerCollision()
      }
    )
  }

  public setShipCamera() {
    this.isShipScale = true
    UIScene.instance.hide()
    this.scale.setGameSize(1200, 800)
  }

  updateCollidersOnWeaponEquip() {
    const weapon = this.player.getWeapon()
    this.playerHarvestableCollider = this.physics.add.collider(
      this.harvestables,
      weapon ? weapon.hitboxImage : this.player,
      (obj1, obj2) => {
        const harvestableRef: Harvestable = obj2.getData('ref')
        harvestableRef.handlePlantPlayerCollision()
      }
    )
    this.playerMobsCollider = this.physics.add.collider(
      this.mobs,
      weapon ? weapon.hitboxImage : this.player,
      (obj1, obj2) => {
        const mobRef: Mob = obj2.getData('ref')
        mobRef.playerMobCollision.handlePlayerWeaponAttack()
      }
    )
  }

  initMobs() {
    const mobsLayer = this.map.getObjectLayer('Mobs')
    this.mobs = this.physics.add.group({
      classType: Mob,
    })

    // TODO: Use procedural generation technique for spawning in mobs
    mobsLayer.objects.forEach((mobObj) => {
      const xPos = mobObj.x! + mobObj.width! * 0.5
      const yPos = mobObj.y! - mobObj.height! * 0.5
      const crab = new Crab(this, { x: xPos, y: yPos, textureKey: 'crab' })
      this.mobsList.push(crab)
      this.mobs.add(crab.sprite)
    })
    const monkey = new Monkey(this, {
      x: 300,
      y: 300,
      textureKey: 'monkey',
    })
    this.mobsList.push(monkey)
    this.mobs.add(monkey.sprite)
    this.playerMobsCollider = this.physics.add.collider(this.mobs, this.player, (obj1, obj2) => {
      const mobRef: Mob = obj2.getData('ref')
      mobRef.playerMobCollision.handlePlayerAttack()
    })
  }

  initItems() {
    const objectLayer = this.map.getObjectLayer('Objects')
    if (!this.items) {
      this.items = this.physics.add.group({ classType: Item })
    }
    objectLayer.objects.forEach((obj) => {
      const xPos = obj.x! + obj.width! * 0.5
      const yPos = obj.y! - obj.height! * 0.5
      const randNum = Math.floor(Math.random() * 2)
      let item: Item | null
      if (randNum === 0) {
        item = ItemFactory.instance.createItem('Rock', xPos, yPos)
      } else {
        item = ItemFactory.instance.createItem('Stick', xPos, yPos)
      }
      if (item) {
        this.itemsOnGround.push(item)
        this.items.add(item.sprite)
      }
    })
    this.playerItemsCollider = this.physics.add.overlap(this.player, this.items, (obj1, obj2) => {
      const item = obj2.getData('ref') as Item
      item.onPlayerHoverItem()
    })
  }

  getAllTileLayers(): Phaser.Tilemaps.TilemapLayer[] {
    return [this.oceanLayer, this.sandLayer, this.grassLayer]
  }

  getAllObjectGroups(): Phaser.GameObjects.Group[] {
    return [this.mobs, this.items, this.harvestables, this.structures]
  }

  addStructure(texture: string, x: number, y: number) {
    if (!this.structures) {
      this.structures = this.physics.add.group({ classType: Structure })
    }
    const structure = new Structure(this, texture, x, y)
    this.structures.add(structure.sprite)
  }

  exitStructure(structure: Structure) {
    this.mobs.setVisible(true)
    this.harvestables.setVisible(true)
    this.oceanLayer.setVisible(true)
    this.sandLayer.setVisible(true)
    this.grassLayer.setVisible(true)
    this.structures.setVisible(true)
    this.items.setVisible(true)

    this.structureEntranceLayer.setVisible(false)
    this.structureInteriorLayer.setVisible(false)
    this.player.setPosition(structure.sprite.x, structure.sprite.body.y + 10)

    this.isInsideStructure = false
    this.playerHarvestableCollider.active = true
    this.playerMobsCollider.active = true
    this.playerItemsCollider.active = true
    this.structureEntranceCollider.active = false
    this.structureInteriorCollider.active = false
  }

  initEnteredStructure(structure: Structure) {
    this.mobs.setVisible(false)
    this.harvestables.setVisible(false)
    this.oceanLayer.setVisible(false)
    this.sandLayer.setVisible(false)
    this.grassLayer.setVisible(false)
    this.structures.setVisible(false)
    this.items.setVisible(false)

    this.isInsideStructure = true
    this.playerHarvestableCollider.active = false
    this.playerMobsCollider.active = false
    this.playerItemsCollider.active = false

    const tentTileMap = this.make.tilemap({ key: 'tent' })
    const tileset = tentTileMap.addTilesetImage('tent-tiles', 'tent-tiles')
    this.structureEntranceLayer = tentTileMap.createLayer('Entrance', tileset)
    this.structureInteriorLayer = tentTileMap.createLayer('Ground', tileset)

    this.structureEntranceLayer
      .setPosition(
        this.player.x - this.structureInteriorLayer.width / 2,
        this.player.y - (this.structureInteriorLayer.height - Constants.TILE_SIZE * 4)
      )
      .setName('Structure')
    this.structureInteriorLayer
      .setPosition(
        this.player.x - this.structureInteriorLayer.width / 2,
        this.player.y - (this.structureInteriorLayer.height - Constants.TILE_SIZE * 4)
      )
      .setName('Structure')
      .setCollisionByProperty({ collides: true })

    if (this.structureEntranceCollider) {
      this.structureEntranceCollider.destroy()
    }
    if (this.structureInteriorCollider) {
      this.structureInteriorCollider.destroy()
    }
    this.structureInteriorCollider = this.physics.add.collider(
      this.structureInteriorLayer,
      this.player
    )
    this.structureEntranceCollider = this.physics.add.overlap(
      this.structureEntranceLayer,
      this.player,
      (obj1, obj2: any) => {
        if (obj2.properties.isEntrance) {
          structure.exitStructure()
          this.exitStructure(structure)
        }
      }
    )
  }

  dropItem(item: Item) {
    this.itemsOnGround.push(item)
    this.items.add(item.sprite)
  }

  update() {
    this.player.update()
    if (!this.isInsideStructure) {
      this.mobsList.forEach((mob: Mob) => {
        mob.update()
      })
    }
    this.updateSortingLayers()
  }

  updateSortingLayers() {
    let lowestLayer = 1
    const sortedByY = this.sys.displayList
      .getChildren()
      .filter((child: any) => {
        return (
          child.y &&
          this.cameras.main.worldView.contains(child.x, child.y) &&
          !this.ignoreNames.includes(child.name)
        )
      })
      .sort((a: any, b: any) => {
        const aY = a.y + a.height / 2
        const bY = b.y + b.height / 2
        return aY - bY
      })

    sortedByY.forEach((c: any, index: number) => {
      if (c.setDepth) {
        c.setDepth(lowestLayer + index)
      }
    })
  }
}
