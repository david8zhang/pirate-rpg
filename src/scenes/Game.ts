import Phaser, { Physics } from 'phaser'
import PalmTree from '../items/PalmTree'
import { Constants } from '../utils/Constants'
import '../characters/Player'
import '../mobs/GiantCrab'
import Player from '../characters/Player'
import { Coconut } from '../items/Coconut'
import { Crab } from '../mobs/Crab'
import { createCrabAnims } from '~/anims/CrabAnims'
import { createCharacterAnims } from '../anims/CharacterAnims'
import { createGiantCrabAnims } from '../anims/GiantCrabAnims'
import { Mob } from '../mobs/Mob'
import { HealthBar } from '../ui/HealthBar'
import { Monkey } from '~/mobs/Monkey'
import { createmonkeyAnims } from '~/anims/MonkeyAnims'
import { debugDraw } from '~/utils/debug'

export default class Game extends Phaser.Scene {
  public player!: Player
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private trees!: Phaser.GameObjects.Group
  private map!: Phaser.Tilemaps.Tilemap

  // Tilemap layers
  public oceanLayer!: Phaser.Tilemaps.TilemapLayer
  public grassLayer!: Phaser.Tilemaps.TilemapLayer
  public sandLayer!: Phaser.Tilemaps.TilemapLayer

  // colliders
  public playerTreeCollider!: Physics.Arcade.Collider
  public treeBeingHit!: PalmTree
  public coconuts: Coconut[] = []

  // Mobs
  public mobsList: Mob[] = []

  constructor() {
    super('game')
  }

  preload(): void {
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
      classType: PalmTree,
    })
    sortedByY.forEach((plantObj) => {
      const xPos = plantObj.x! + plantObj.width! * 0.5
      const yPos = plantObj.y! - plantObj.height! * 0.5
      this.trees.get(xPos, yPos, 'palm-trees', 1)
    })

    this.playerTreeCollider = this.physics.add.collider(
      this.player,
      this.trees,
      this.handlePlayerTreeCollision,
      undefined,
      this
    )
  }

  initMobs() {
    const mobsLayer = this.map.getObjectLayer('Mobs')
    const mobsGroup = this.physics.add.group({
      classType: Mob,
    })
    mobsLayer.objects.forEach((mobObj) => {
      const xPos = mobObj.x! + mobObj.width! * 0.5
      const yPos = mobObj.y! - mobObj.height! * 0.5
      const crab = new Crab(this, { x: xPos, y: yPos, textureKey: 'crab' })
      this.mobsList.push(crab)
      mobsGroup.add(crab.sprite)
    })
    const monkey = new Monkey(this, {
      x: 300,
      y: 300,
      textureKey: 'monkey',
    })
    this.mobsList.push(monkey)
  }

  handlePlayerTreeCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.treeBeingHit = obj2 as PalmTree
    if (!this.treeBeingHit.isBeingHit && this.player.getCurrState() === 'attack') {
      this.treeBeingHit.takeDamage(10)
      this.treeBeingHit.isBeingHit = true
      this.time.delayedCall(Constants.ATTACK_DURATION, () => {
        this.treeBeingHit.isBeingHit = false
      })
    }
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
          child.name !== 'InAir'
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
