import Phaser, { Physics } from 'phaser'
import { ALL_EFFECTS, ALL_HARVESTABLES, ALL_SHIP_TYPES, Constants } from '../utils/Constants'
import '../characters/Player'
import Player from '../characters/Player'
import { createCharacterAnims } from '../anims/CharacterAnims'
import { Mob } from '../mobs/Mob'
import { Item } from '~/objects/Item'
import { HoverText } from '~/ui/HoverText'
import { ItemFactory } from '~/objects/ItemFactory'
import { Harvestable } from '~/objects/Harvestable'
import UIScene from './GameUIScene'
import { ParticleSpawner } from '~/lib/components/ParticleSpawner'
import { Structure } from '~/objects/Structure'
import { Transport } from '~/objects/Transport'
import { ItemConfig } from '~/objects/ItemConfig'
import { createMobAnims } from '~/anims/MobAnims'
import { ALL_MOBS } from '../utils/Constants'
import { Ship } from '~/objects/Ship'
import { Projectile } from '~/objects/Projectile'
import { ShipUIScene } from './ShipUIScene'
import { MobSpawner } from '~/mobs/MobSpawner'
import { EnemyShip } from '~/objects/EnemyShip'
import { createEffectsAnims } from '~/anims/EffectsAnims'
import { EffectSpawner } from '~/objects/Effect'
import { createShipAnims } from '~/anims/ShipAnims'

export default class Game extends Phaser.Scene {
  public player!: Player
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  public map!: Phaser.Tilemaps.Tilemap
  private static _instance: Game

  // Tilemap layers
  public oceanLayer!: Phaser.Tilemaps.TilemapLayer
  public grassLayer!: Phaser.Tilemaps.TilemapLayer
  public sandLayer!: Phaser.Tilemaps.TilemapLayer
  public structureInteriorLayer!: Phaser.Tilemaps.TilemapLayer
  public structureEntranceLayer!: Phaser.Tilemaps.TilemapLayer

  // colliders
  public playerHarvestableCollider!: Physics.Arcade.Collider
  public playerMobsCollider!: Physics.Arcade.Collider
  public playerItemsCollider!: Physics.Arcade.Collider
  public playerOceanCollider!: Physics.Arcade.Collider

  // Mobs
  public mobsList: Mob[] = []
  public mobs!: Phaser.GameObjects.Group
  public spawners: MobSpawner[] = []

  // Harvestables (Trees, bushes, etc.)
  public harvestableList: Harvestable[] = []
  public harvestables!: Phaser.GameObjects.Group

  // Items
  public items!: Phaser.GameObjects.Group
  public itemsOnGround: Item[] = []

  // Projectiles
  public projectiles!: Phaser.GameObjects.Group

  // Ships
  public ships!: Phaser.GameObjects.Group
  public enemyShips!: Phaser.GameObjects.Group

  // Structures
  public enteredStructure: Structure | null = null
  public structures!: Phaser.GameObjects.Group | null
  public structureLayer!: Phaser.Tilemaps.TilemapLayer
  public isInsideStructure: boolean = false
  public structureInteriorCollider!: Phaser.Physics.Arcade.Collider
  public structureEntranceCollider!: Phaser.Physics.Arcade.Collider

  // Transports
  public transports!: Phaser.GameObjects.Group | null
  public ship!: Ship

  // sprite names to ignore during depth-sorting
  public ignoreNames = ['InAir', 'UI', 'Weapon', 'Structure', 'Transport', 'Effect']

  // UI text
  public hoverText!: HoverText

  // Item Factory
  public itemFactory: ItemFactory
  public particleSpawner: ParticleSpawner
  public effectSpawner!: EffectSpawner

  constructor() {
    super('game')
    this.itemFactory = new ItemFactory(this)
    this.particleSpawner = new ParticleSpawner(this)
    Game._instance = this
    this.effectSpawner = new EffectSpawner()
  }

  loadSaveFile() {
    const rawSaveData = localStorage.getItem('saveFile')
    if (rawSaveData) {
      const saveFile = JSON.parse(rawSaveData)

      // Configure player
      const { player, enteredStructure } = saveFile

      if (player.ship) {
        const shipConfig = Constants.getShip(player.ship.type)
        if (shipConfig) {
          const playerShip = new Ship(
            this,
            shipConfig,
            { x: player.ship.x, y: player.ship.y },
            player.ship.currDirection
          )
          this.addShip(playerShip)
          this.player.ship = playerShip
          this.player.enterShip(this.player.ship)
          if (player.ship.isSteering) {
            this.player.isSteeringShip = true
            const interval = setInterval(() => {
              if (ShipUIScene.instance) {
                this.player.ship!.takeWheel()
                this.player.ship?.setCurrHealth(player.ship.health)
                clearInterval(interval)
              }
            }, 100)
          }
        }
      }
      if (player.transport) {
        const transportConfig = Constants.getItem(player.transport.name)
        if (transportConfig) {
          this.player.enterableTransport = new Transport(
            this,
            transportConfig,
            player.transport.x,
            player.transport.y
          )
          this.player.enterableTransport.enterTransport()
        }
      }
      if (enteredStructure.texture) {
        const structure = this.addStructure(
          enteredStructure.texture,
          enteredStructure.x,
          enteredStructure.y
        )
        this.initEnteredStructure(structure)
      }

      if (saveFile.structures) {
        saveFile.structures.forEach((s) => {
          this.addStructure(s.texture, s.x, s.y)
        })
      }

      if (saveFile.ships) {
        saveFile.ships.forEach((s) => {
          const shipConfig = Constants.getShip(s.type)
          if (shipConfig) {
            const ship = new Ship(this, shipConfig, { x: s.x, y: s.y }, s.currDirection)
            this.addShip(ship)
          }
        })
      }

      this.player.setX(player.x)
      this.player.setY(player.y)
      this.player.setInventory(player.inventory)
      this.player.setEquipment(player.equipment)
      this.player.setCurrHealth(player.health)
    }
  }

  public static get instance() {
    return Game._instance
  }

  restart() {
    this.player.respawn(200, 200)
  }

  preload(): void {
    this.hoverText = new HoverText(this, 0, 0)
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create(): void {
    createCharacterAnims(this.anims)
    createMobAnims(ALL_MOBS, this.anims)
    createEffectsAnims(ALL_EFFECTS, this.anims)
    createShipAnims(ALL_SHIP_TYPES, this.anims)
    this.initTilemap()
    this.initPlayer()
    this.initPlants()
    this.initMobs()
    this.initItems()
    this.initProjectiles()
    this.initShips()
    this.initEnemyShips()
    this.initSpawners()
    this.loadSaveFile()
  }

  initTilemap() {
    this.map = this.make.tilemap({ key: 'starter-island-large' })
    const tileset = this.map.addTilesetImage('beach-tiles', 'beach-tiles')
    this.oceanLayer = this.map.createLayer('Ocean', tileset).setName('Ocean')
    this.sandLayer = this.map.createLayer('Sand', tileset).setName('Sand')
    this.grassLayer = this.map.createLayer('Grass', tileset).setName('Grass')
    this.sandLayer.setCollisionByProperty({ collides: true })
    this.oceanLayer.setCollisionByProperty({ collides: true })
    this.grassLayer.setCollisionByProperty({ collides: true })
  }

  initPlayer() {
    // TODO: Fix this
    this.player = this.add.player(100, 100, 'player')
    this.player.setDepth(1)
    this.player.setOnEquipWeaponHandler(() => {
      this.updateCollidersOnWeaponEquip()
    })
    // this.playerOceanCollider = this.physics.add.collider(this.player, this.oceanLayer)
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

    // TODO: Add other plant types
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

  initProjectiles() {
    this.projectiles = this.physics.add.group({ classType: Projectile })
    this.physics.add.collider(this.projectiles, this.mobs, (obj1, obj2) => {
      const projectile: Projectile = obj1.getData('ref')
      const mob: Mob = obj2.getData('ref')
      if (projectile) {
        projectile.onHitMob(mob)
      }
    })
    this.physics.add.collider(this.projectiles, this.harvestables, (obj1, obj2) => {
      const projectile: Projectile = obj1.getData('ref')
      const harvestable: Harvestable = obj2.getData('ref')
      projectile.onHitHarvestable(harvestable)
    })
  }

  addProjectile(projectile: Projectile) {
    this.projectiles.add(projectile.sprite)
  }

  initShips() {
    this.ships = this.physics.add.group({ classType: Ship })
    const ship1 = new Ship(this, ALL_SHIP_TYPES[0], { x: 1000, y: 1000 })
    const ship2 = new Ship(this, ALL_SHIP_TYPES[0], { x: 1200, y: 500 })
    this.ships.add(ship1.hullSprite)
    this.ships.add(ship2.hullSprite)
    this.physics.add.overlap(this.ships, this.projectiles, (obj1, obj2) => {
      const ship: Ship = obj1.getData('ref')
      const projectile: Projectile = obj2.getData('ref')
      if (projectile.sourceShip !== ship) {
        projectile.onHitShip(ship)
      }
    })
  }

  initEnemyShips() {}

  public enableShipCamera() {
    UIScene.instance.hide()
    ShipUIScene.instance.show()
    this.scale.setGameSize(1200, 750)
  }

  public disableShipCamera() {
    UIScene.instance.show()
    ShipUIScene.instance.hide()
    this.scale.setGameSize(600, 375)
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
        if (this.player.getCurrState() === 'attack') {
          mobRef.onHit(weapon ? weapon.damage : Player.UNARMED_DAMAGE)
        }
      }
    )
  }

  initSpawners() {
    const spawnerLayer = this.map.getObjectLayer('Spawners')
    spawnerLayer.objects.forEach((spawnerObj) => {
      const xPos = spawnerObj.x! + spawnerObj.width! * 0.5
      const yPos = spawnerObj.y! - spawnerObj.height! * 0.5
      const config = Constants.getMob(spawnerObj.type)
      this.spawners.push(
        new MobSpawner(this, {
          position: { x: xPos, y: yPos },
          spawnDelay: 2000,
          mobConfig: config,
          mobLimit: Math.floor(Math.random() * 3 + 2),
        })
      )
    })
  }

  initMobs() {
    this.mobs = this.physics.add.group({
      classType: Mob,
    })
    this.playerMobsCollider = this.physics.add.collider(this.mobs, this.player, (obj1, obj2) => {
      const mobRef: Mob = obj2.getData('ref')
      if (this.player.getCurrState() === 'attack') {
        mobRef.onHit(Player.UNARMED_DAMAGE)
      }
    })

    const skeletonConfig = Constants.getMob('Skeleton')
    const mob = new Mob(this, 100, 150, skeletonConfig)
    this.addMob(mob)
  }

  public addMob(mob: Mob) {
    this.mobsList.push(mob)
    this.mobs.add(mob.sprite)
  }

  public saveAndQuit() {
    const saveObject: any = {
      player: {
        health: this.player.currHealth,
        x: this.player.x,
        y: this.player.y,
        inventory: this.player.inventory,
        equipment: {
          weapon: {
            name: this.player.equipment.weapon ? this.player.equipment.weapon.name : '',
            isEquipped: this.player.equipment.weapon
              ? this.player.equipment.weapon.isEquipped
              : false,
          },
        },
        ship: {},
        transport: {},
      },
      enteredStructure: {},
    }
    if (this.enteredStructure) {
      saveObject.enteredStructure = {
        texture: this.enteredStructure.texture,
        x: this.enteredStructure.sprite.x,
        y: this.enteredStructure.sprite.y,
      }
    }
    if (this.structures) {
      const structuresToSave: any[] = []
      this.structures.getChildren().forEach((structure) => {
        const s = structure.getData('ref')
        if (s !== this.enteredStructure) {
          structuresToSave.push({
            texture: s.texture,
            x: s.sprite.x,
            y: s.sprite.y,
          })
        }
      })
      saveObject.structures = structuresToSave
    }
    if (this.player.currTransport) {
      saveObject.player.transport = {
        x: this.player.currTransport.sprite.x,
        y: this.player.currTransport.sprite.y,
        currDirection: this.player.currTransport.currDirection,
        name: this.player.currTransport.itemRef.name,
      }
    }
    if (this.player.ship) {
      saveObject.player.ship = {
        x: this.player.ship.hullSprite.x,
        y: this.player.ship.hullSprite.y,
        type: this.player.ship.shipType,
        isSteering: this.player.isSteeringShip,
        currDirection: this.player.ship.currDirection,
        health: this.player.ship.health,
      }
    }
    if (this.ships) {
      const savedShips: any[] = []
      this.ships.getChildren().forEach((s) => {
        const ship = s.getData('ref')
        const isEnemyShip = ship instanceof EnemyShip
        if (this.player.ship !== ship && !isEnemyShip) {
          savedShips.push({
            x: ship.hullSprite.x,
            y: ship.hullSprite.y,
            type: ship.shipType,
            currDirection: ship.currDirection,
            health: ship.health,
          })
        }
      })
      saveObject.ships = savedShips
    }
    localStorage.setItem('saveFile', JSON.stringify(saveObject))
    if (this.transports) {
      this.transports.destroy()
      this.transports = null
    }
    if (this.structures) {
      this.structures.destroy()
      this.structures = null
    }
  }

  initItems() {
    const objectLayer = this.map.getObjectLayer('Objects')
    if (!this.items) {
      this.items = this.physics.add.group({ classType: Item })
    } else {
      this.items.destroy()
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

  addItem(item) {
    this.itemsOnGround.push(item)
    this.items.add(item.sprite)
  }

  getAllTileLayers(): Phaser.Tilemaps.TilemapLayer[] {
    return [this.oceanLayer, this.sandLayer, this.grassLayer]
  }

  getAllObjectGroups(): Phaser.GameObjects.Group[] {
    const allGroups: Phaser.GameObjects.Group[] = []
    if (this.mobs) {
      allGroups.push(this.mobs)
    }
    if (this.items) {
      allGroups.push(this.items)
    }
    if (this.harvestables) {
      allGroups.push(this.harvestables)
    }
    if (this.ships) {
      allGroups.push(this.ships)
    }
    if (this.structures) {
      allGroups.push(this.structures)
    }
    if (this.transports) {
      allGroups.push(this.transports)
    }
    return allGroups
  }

  addTransport(itemRef: ItemConfig, x: number, y: number) {
    if (!this.transports) {
      this.transports = this.physics.add.group({ classType: Transport })
    }
    const transport = new Transport(this, itemRef, x, y)
    this.transports.add(transport.sprite)
  }

  addShip(ship: Ship) {
    this.ships.add(ship.hullSprite)
  }

  addStructure(texture: string, x: number, y: number): Structure {
    if (!this.structures) {
      this.structures = this.physics.add.group({ classType: Structure })
    }
    const structure = new Structure(this, texture, x, y)
    this.structures.add(structure.sprite)
    return structure
  }

  exitStructure(structure: Structure) {
    this.enteredStructure = null
    this.mobs.setVisible(true)
    this.harvestables.setVisible(true)
    this.oceanLayer.setVisible(true)
    this.sandLayer.setVisible(true)
    this.grassLayer.setVisible(true)
    if (this.structures) {
      this.structures.setVisible(true)
    }
    this.items.setVisible(true)
    this.ships.children.entries.forEach((c) => {
      const ship: Ship = c.getData('ref')
      ship.setVisible(true)
    })

    if (this.transports) {
      this.transports.setVisible(true)
    }

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
    this.enteredStructure = structure
    this.mobs.setVisible(false)
    this.harvestables.setVisible(false)
    this.oceanLayer.setVisible(false)
    this.sandLayer.setVisible(false)
    this.grassLayer.setVisible(false)
    if (this.structures) {
      this.structures.setVisible(false)
    }
    this.items.setVisible(false)
    this.ships.children.entries.forEach((child) => {
      const ship: Ship = child.getData('ref')
      ship.setVisible(false)
    })
    if (this.transports) {
      this.transports.setVisible(false)
    }

    this.isInsideStructure = true
    this.playerHarvestableCollider.active = false
    this.playerMobsCollider.active = false
    this.playerItemsCollider.active = false

    const tentTileMap = this.make.tilemap({ key: 'tent' })
    const tileset = tentTileMap.addTilesetImage('tent-tiles', 'tent-tiles')
    this.structureEntranceLayer = tentTileMap.createLayer('Entrance', tileset)
    this.structureInteriorLayer = tentTileMap.createLayer('Ground', tileset)

    this.player.x = Constants.BG_WIDTH / 2
    this.player.y = Constants.BG_HEIGHT / 2

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
    if (this.player.ship && !this.player.ship.isAnchored) {
      ShipUIScene.instance.show()
    } else {
      ShipUIScene.instance.hide()
    }
    this.player.update()
    if (!this.isInsideStructure) {
      this.mobsList.forEach((mob: Mob) => {
        mob.update()
      })
    }
    this.updateSortingLayers()
    this.ships.children.entries.forEach((child) => {
      const ship = child.getData('ref')
      ship.update()
    })
    this.removeAllDeadMobs()
  }

  removeAllDeadMobs() {
    this.mobsList = this.mobsList.filter((mob) => {
      return mob.health > 0
    })
  }

  updateSortingLayers() {
    const getY = (data) => {
      const ref = data.getData('ref')
      if (ref instanceof Ship) {
        return ref.getCenterPoint().y
      } else {
        return data.y + data.height / 2
      }
    }

    let lowestLayer = 1
    const sortedByY = this.sys.displayList
      .getChildren()
      .filter((child: any) => {
        let y = child.y
        const ref = child.getData ? child.getData('ref') : null
        if (ref instanceof Ship) {
          y = ref.getCenterPoint().y
        }
        return y && !this.ignoreNames.includes(child.name)
      })
      .sort((a: any, b: any) => {
        const aY = getY(a)
        const bY = getY(b)
        return aY - bY
      })

    sortedByY.forEach((c: any, index: number) => {
      if (c.setDepth) {
        c.setDepth(lowestLayer + index)
      }
    })
  }
}
