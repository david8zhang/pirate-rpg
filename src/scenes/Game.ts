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
import { Item } from '~/items/Item'
import { PickupObjectText } from '~/ui/PickupObjectText'
import { ItemFactory } from '~/items/ItemFactory'
import { Harvestable } from '~/items/Harvestable'
import UIScene from './UIScene'
import { ParticleSpawner } from '~/lib/components/ParticleSpawner'

export default class Game extends Phaser.Scene {
  public player!: Player
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private trees!: Phaser.GameObjects.Group
  private mobs!: Phaser.GameObjects.Group
  private map!: Phaser.Tilemaps.Tilemap

  // Tilemap layers
  public oceanLayer!: Phaser.Tilemaps.TilemapLayer
  public grassLayer!: Phaser.Tilemaps.TilemapLayer
  public sandLayer!: Phaser.Tilemaps.TilemapLayer
  public objectsLayer!: Phaser.Tilemaps.TilemapLayer

  // colliders
  public playerHarvestableCollider!: Physics.Arcade.Collider
  public playerMobsCollider!: Physics.Arcade.Collider
  public itemsOnGround: Item[] = []

  // Mobs & Harvestables
  public mobsList: Mob[] = []
  public harvestableList: Harvestable[] = []

  // sprite names to ignore during depth-sorting
  public ignoreNames = ['InAir', 'UI', 'Weapon']

  // UI text
  public pickupObjText!: PickupObjectText
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
    this.pickupObjText = new PickupObjectText(this, 0, 0)
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
    this.initObjects()

    const img = this.add.image(300, 300, 'tent')
  }

  initTilemap() {
    this.map = this.make.tilemap({ key: 'starter-island-2' })
    const tileset = this.map.addTilesetImage('beach-tiles', 'tiles')
    this.oceanLayer = this.map.createLayer('Ocean', tileset)
    this.sandLayer = this.map.createLayer('Sand', tileset)
    this.grassLayer = this.map.createLayer('Grass', tileset)
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
    this.trees = this.physics.add.group({
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
      this.trees.add(harvestable.sprite)
      this.harvestableList.push(harvestable)
    })

    this.playerHarvestableCollider = this.physics.add.collider(
      this.trees,
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
      this.trees,
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

  initObjects() {
    const objectLayer = this.map.getObjectLayer('Objects')
    objectLayer.objects.forEach((obj) => {
      const xPos = obj.x! + obj.width! * 0.5
      const yPos = obj.y! - obj.height! * 0.5
      const randNum = Math.floor(Math.random() * 2)
      if (randNum === 0) {
        const rock = ItemFactory.instance.createItem('Rock', xPos, yPos)
        if (rock) {
          this.itemsOnGround.push(rock)
        }
      } else {
        const stick = ItemFactory.instance.createItem('Stick', xPos, yPos)
        if (stick) {
          this.itemsOnGround.push(stick)
        }
      }
    })
  }

  update() {
    this.player.update()
    this.mobsList.forEach((mob: Mob) => {
      mob.update()
    })
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
