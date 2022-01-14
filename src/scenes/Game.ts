import Phaser, { Physics } from 'phaser'
import { ALL_EFFECTS, ALL_SHIP_TYPES, CAPTAIN_TO_CREW_TYPE, Constants } from '../utils/Constants'
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
import { Map } from '~/lib/Map'

export default class Game extends Phaser.Scene {
  public player!: Player
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private static _instance: Game

  // Map
  public map!: Map

  // colliders
  public playerHarvestableCollider!: Physics.Arcade.Collider
  public playerMobsCollider!: Physics.Arcade.Collider
  public playerItemsCollider!: Physics.Arcade.Collider
  public playerOceanCollider!: Physics.Arcade.Collider

  // Mobs
  public mobs!: Phaser.GameObjects.Group
  public mobPool: Mob[] = []
  public static MAX_MOBS_IN_POOL = 50
  public spawnersPool: any = {}

  // Harvestables (Trees, bushes, etc.)
  public harvestableList: Harvestable[] = []
  public static MAX_HARVESTABLES_IN_POOL = 1000
  public harvestables!: Phaser.GameObjects.Group

  // Items
  public items!: Phaser.GameObjects.Group
  public static MAX_ITEMS_ON_SCREEN = 50
  public itemPool: any = {}
  public itemLocations: any[] = []

  // Projectiles
  public projectiles!: Phaser.GameObjects.Group

  // Ships
  public ships!: Phaser.GameObjects.Group
  public shipGroupings!: Phaser.GameObjects.Container
  public enemyShips!: Phaser.GameObjects.Group

  // Structures
  public structures!: Phaser.GameObjects.Group | null
  public structureLayer!: Phaser.Tilemaps.TilemapLayer

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
      const { player } = saveFile

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
      this.player.setCurrStamina(player.stamina)
    }
  }

  public static get instance() {
    return Game._instance
  }

  restart() {
    const spawnPos = this.map.spawnPos
    this.player.respawn(spawnPos.x, spawnPos.y)
  }

  preload(): void {
    this.hoverText = new HoverText(this, 0, 0)
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  getTileAt(x: number, y: number) {
    const layers = this.getAllTileLayers()
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i]
      const check = layer.getTileAtWorldXY(x, y)
      if (check) {
        return check.layer.name
      }
    }
  }

  create(): void {
    createCharacterAnims(this.anims)
    createMobAnims(ALL_MOBS, this.anims)
    createEffectsAnims(ALL_EFFECTS, this.anims)
    createShipAnims(ALL_SHIP_TYPES, this.anims)
    this.initWorldCollider()
    this.initTilemap()
    this.initPlayer()
    this.initHarvestables()
    this.initMobs()
    this.initItems()
    this.initProjectiles()
    this.initShips()
    this.initEnemyShips()
    this.loadSaveFile()
    // this.scale.setGameSize(1200 * 5, 750 * 5)

    this.input.on(
      'pointerdown',
      function (pointer) {
        if (pointer.leftButtonDown()) {
          console.log('X:', Math.round(pointer.worldX))
          console.log('Y:', Math.round(pointer.worldY))
        }
      },
      this
    )
  }

  initWorldCollider() {
    this.physics.world.setBounds(
      0,
      0,
      Constants.BG_WIDTH,
      Constants.BG_HEIGHT,
      true,
      true,
      true,
      true
    )
  }

  lazyLoadSpawners() {
    const locations = this.map.spawners
      .sort((a, b) => {
        return a.y! - b.y!
      })
      .map((obj) => {
        return {
          x: obj.x!,
          y: obj.y!,
          type: obj.type,
        }
      })
    locations.forEach((spawnerObj) => {
      const config = Constants.getMob(spawnerObj.type)
      const xPos = spawnerObj.x!
      const yPos = spawnerObj.y!
      if (this.cameras.main.worldView.contains(xPos, yPos) && config) {
        if (!this.spawnersPool[`${xPos},${yPos}`]) {
          const newSpawner = new MobSpawner(this, {
            position: { x: xPos, y: yPos },
            spawnDelay: 20000,
            mobConfig: config,
            mobLimit: Constants.getRandomNum(config.spawn.lowerLimit, config.spawn.upperLimit),
          })
          this.spawnersPool[`${xPos},${yPos}`] = newSpawner
        }
      }
    })
  }

  initTilemap() {
    this.map = new Map(this)
  }

  initPlayer() {
    const { x, y } = this.map.spawnPos
    this.player = this.add.player(x, y, 'player')
    this.player.setDepth(1)
    this.player.setOnEquipWeaponHandler(() => {
      this.updateCollidersOnWeaponEquip()
    })
    this.cameras.main.setBounds(0, 0, Constants.BG_WIDTH, Constants.BG_HEIGHT)
    this.cameras.main.startFollow(this.player, true)
  }

  lazyLoadHarvestables() {
    const locations = this.map.harvestables
      .sort((a, b) => {
        return a.y! - b.y!
      })
      .map((obj) => {
        return {
          x: obj.x!,
          y: obj.y!,
          type: obj.type,
          tileX: obj.tileX,
          tileY: obj.tileY,
        }
      })
    const isInHarvestablesList = (x: number, y: number) => {
      return (
        this.harvestableList.find((h: Harvestable) => {
          return h.sprite.x === x && h.sprite.y === y
        }) !== undefined
      )
    }
    const getAvailableHarvestable = () => {
      return this.harvestableList.find((h: Harvestable) => {
        return !this.cameras.main.worldView.contains(h.sprite.x, h.sprite.y)
      })
    }
    locations.forEach(({ x, y, type, tileX, tileY }) => {
      if (this.cameras.main.worldView.contains(x, y)) {
        if (!isInHarvestablesList(x, y)) {
          const harvestableConfig = Constants.getHarvestable(type)
          if (this.harvestableList.length >= Game.MAX_HARVESTABLES_IN_POOL) {
            const recyclableHarvestable = getAvailableHarvestable()
            if (recyclableHarvestable && harvestableConfig) {
              recyclableHarvestable.initNewConfig({
                ...harvestableConfig,
                xPos: x,
                yPos: y,
              })
            }
          } else {
            if (harvestableConfig) {
              const harvestable = new Harvestable(
                this,
                {
                  ...harvestableConfig,
                  xPos: x,
                  yPos: y,
                },
                {
                  x: tileX,
                  y: tileY,
                }
              )
              this.harvestableList.push(harvestable)
              this.harvestables.add(harvestable.sprite)
            }
          }
        }
      }
    })
  }

  clearHarvestables() {
    this.harvestableList.forEach((h) => h.cleanup())
    this.harvestables.clear()
    this.harvestableList = []
  }

  clearSpawnersAndMobs() {
    this.mobs.clear()
    Object.keys(this.spawnersPool).forEach((key) => this.spawnersPool[key].destroy())
    this.mobPool.forEach((mob) => mob.destroy())
    this.spawnersPool = {}
    this.mobPool = []
  }

  initHarvestables() {
    // initialize harvestables (things that drop stuff when the player hits them)
    this.harvestables = this.physics.add.group({
      classType: Harvestable,
    })

    this.playerHarvestableCollider = this.physics.add.collider(
      this.harvestables,
      this.player,
      (obj1, obj2) => {
        const harvestableRef: Harvestable = obj2.getData('ref')
        harvestableRef.handlePlayerHarvestableCollision()
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
    this.physics.add.overlap(this.ships, this.projectiles, (obj1, obj2) => {
      const ship: Ship = obj1.getData('ref')
      const projectile: Projectile = obj2.getData('ref')
      if (projectile.sourceShip !== ship) {
        projectile.onHitShip(ship)
      }
    })
  }

  initEnemyShips() {
    this.map.enemyShipConfigs.forEach((config) => {
      const { captainMobType, shipType, x, y } = config
      const shipConfig = Constants.getShip(shipType)
      const mobConfig = Constants.getMob(captainMobType)
      if (shipConfig && mobConfig) {
        const enemyShipCaptain = new Mob(this, 0, 0, mobConfig)
        const enemyShip = new EnemyShip(this, shipConfig, {
          x: x,
          y: y,
        })
        enemyShip.setCrew(CAPTAIN_TO_CREW_TYPE[captainMobType], shipConfig.numCrew)
        enemyShip.setMobInControl(enemyShipCaptain)
        enemyShipCaptain.startSailing(enemyShip)
        this.ships.add(enemyShip.hullSprite)
        this.addMob(enemyShipCaptain)
      }
    })
  }

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
        harvestableRef.handlePlayerHarvestableCollision()
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

  removeMobFromPool(mob: Mob) {
    this.mobPool = this.mobPool.filter((m: Mob) => {
      return m !== mob
    })
  }

  isMobPoolFull() {
    return this.mobPool.length >= Game.MAX_MOBS_IN_POOL
  }

  hasAvailableMobInPool() {
    if (this.mobPool.length < Game.MAX_MOBS_IN_POOL) {
      return true
    }
    const offscreenMob = this.mobPool.find((mob) => {
      return (
        !this.cameras.main.worldView.contains(mob.sprite.x, mob.sprite.y) &&
        mob.activeBehavior.name !== 'SAIL'
      )
    })
    return offscreenMob !== undefined
  }

  getAvailableMobInPool() {
    const offscreenMob = this.mobPool.find((mob) => {
      return (
        !this.cameras.main.worldView.contains(mob.sprite.x, mob.sprite.y) &&
        mob.activeBehavior.name !== 'SAIL'
      )
    })
    return offscreenMob ? offscreenMob : null
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
  }

  public removeHarvestable(tileX: number, tileY: number) {
    this.map.addToRemovedHarvestables(tileX, tileY)
  }

  public addMob(mob: Mob) {
    this.mobs.add(mob.sprite)
    const spriteBody = mob.sprite.body as Phaser.Physics.Arcade.Body
    spriteBody.setCollideWorldBounds(true)
    spriteBody.onWorldBounds = true
    this.mobPool.push(mob)
  }

  public saveAndQuit() {
    const saveObject: any = {
      map: {
        seed: this.map.mapSeed,
        offset: this.map.currMapOffset,
        removedHarvestables: this.map.getRemovedHarvestablesAsFlatList(),
      },
      player: {
        health: this.player.currHealth,
        stamina: this.player.currStamina,
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
    }
    if (this.structures) {
      const structuresToSave: any[] = []
      this.structures.getChildren().forEach((structure) => {
        const s = structure.getData('ref')
        structuresToSave.push({
          texture: s.texture,
          x: s.sprite.x,
          y: s.sprite.y,
        })
      })
      saveObject.structures = structuresToSave
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
    this.clearItemPool()
    this.clearMobPool()
    this.clearHarvestablesPool()
    this.clearSpawnerPool()
  }

  clearSpawnerPool() {
    Object.keys(this.spawnersPool).forEach((key) => {
      this.spawnersPool[key].destroy()
    })
    this.spawnersPool = {}
  }

  clearHarvestablesPool() {
    this.harvestableList.forEach((h) => {
      h.destroy()
    })
    this.harvestableList = []
  }

  clearMobPool() {
    this.mobPool.forEach((m) => {
      m.destroy()
    })
    this.mobPool = []
  }

  clearItemPool() {
    Object.keys(this.itemPool).forEach((key) => {
      if (this.itemPool[key]) {
        this.itemPool[key].destroy()
      }
    })
    this.itemPool = {}
  }

  lazyLoadItems() {
    const getExistingOffscreenItem = () => {
      const itemKey = Object.keys(this.itemPool).find((key) => {
        const itemSprite = this.itemPool[key].sprite
        return !this.cameras.main.worldView.contains(itemSprite.x, itemSprite.y)
      })
      if (itemKey) {
        return this.itemPool[itemKey]
      }
      return null
    }

    const objectLayer = this.map.tileMap.getObjectLayer('Objects')
    const allItemTypes = ['Rock', 'Stick']
    const locations = objectLayer.objects.map((obj) => ({
      x: obj.x! + obj.width! * 0.5,
      y: obj.y! - obj.height! * 0.5,
    }))
    locations.forEach((obj) => {
      const { x, y } = obj
      if (this.cameras.main.worldView.contains(x, y)) {
        let type = ''
        type = allItemTypes[Math.floor(x) % allItemTypes.length]
        if (!this.itemPool[`${x},${y}`]) {
          if (Object.keys(this.itemPool).length < Game.MAX_ITEMS_ON_SCREEN) {
            const item = ItemFactory.instance.createItem(type, x, y)
            if (item) {
              this.itemPool[`${x},${y}`] = item
              this.items.add(item.sprite)
            }
          } else {
            const offscreenItem = getExistingOffscreenItem() as Item
            if (offscreenItem) {
              offscreenItem.changeConfig(type, x, y)
              this.itemPool[`${offscreenItem.sprite.x},${offscreenItem.sprite.y}`] = null
              this.itemPool[`${x},${y}`] = offscreenItem
            }
          }
        }
      }
    })
  }

  generateItemLocations() {
    const itemLocations: any[] = []
    for (let i = 0; i < 10000; i++) {
      const x = Math.floor(Math.random() * Constants.BG_WIDTH)
      const y = Math.floor(Math.random() * Constants.BG_HEIGHT)
      itemLocations.push({
        x,
        y,
      })
    }
    return itemLocations
  }

  initItems() {
    this.itemLocations = this.generateItemLocations()
    if (!this.items) {
      this.items = this.physics.add.group({ classType: Item })
    } else {
      this.items.destroy()
      this.items = this.physics.add.group({ classType: Item })
    }
    this.playerItemsCollider = this.physics.add.overlap(this.player, this.items, (obj1, obj2) => {
      const item = obj2.getData('ref') as Item
      item.onPlayerHoverItem()
    })
  }

  addItem(item: Item) {
    this.itemPool[`${item.sprite.x},${item.sprite.y}`] = item
    this.items.add(item.sprite)
  }

  removeItem(item: Item) {
    delete this.itemPool[`${item.sprite.x},${item.sprite.y}`]
  }

  getAllTileLayers(): Phaser.Tilemaps.TilemapLayer[] {
    return this.map.layers
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

  moveShipsBasedOnMapOffset(toTransitionMapKey: string) {
    this.ships.children.entries.forEach((shipObj) => {
      const ship: Ship = shipObj.getData('ref')
      if (ship !== this.player.ship) {
        const currShipPos = { x: ship.hullSprite.x, y: ship.hullSprite.y }
        switch (toTransitionMapKey) {
          case 'up': {
            currShipPos.y += Constants.BG_HEIGHT
            break
          }
          case 'down': {
            currShipPos.y -= Constants.BG_HEIGHT
            break
          }
          case 'left': {
            currShipPos.x += Constants.BG_WIDTH
            break
          }
          case 'right': {
            currShipPos.x -= Constants.BG_WIDTH
            break
          }
        }
        ship.setShipEnablement(true)
        ship.setPosition(currShipPos.x, currShipPos.y)
      }
    })
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

  dropItem(item: Item) {
    this.itemPool[`${item.sprite.x},${item.sprite.y}`] = item
    this.items.add(item.sprite)
  }

  update() {
    if (this.player.ship && !this.player.ship.isAnchored) {
      ShipUIScene.instance.show()
    } else {
      ShipUIScene.instance.hide()
    }
    this.player.update()
    this.mobPool.forEach((mob: Mob) => {
      mob.update()
    })
    this.lazyLoadSpawners()
    this.lazyLoadHarvestables()
    this.updateSortingLayers()
    this.ships.children.entries.forEach((child) => {
      const ship = child.getData('ref')
      ship.update()
    })
    this.removeAllDeadMobs()
  }

  removeAllDeadMobs() {
    this.mobPool = this.mobPool.filter((mob) => {
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
