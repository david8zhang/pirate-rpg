import Phaser, { Physics } from 'phaser'
import PalmTree from '../items/PalmTree'
import { Constants } from '../utils/Constants'
import { createCharacterAnims } from '../anims/CharacterAnims'
import '../characters/Player'
import '../mobs/GiantCrab'
import Player from '../characters/Player'
import { Coconut } from '../items/Coconut'
import { createGiantCrabAnims } from '~/anims/GiantCrabAnims'
import { GiantCrab } from '../mobs/GiantCrab'
import { Crab } from '../mobs/Crab'
import { createCrabAnims } from '~/anims/CrabAnims'
import { Item } from '~/items/Item'

export default class Game extends Phaser.Scene {
  public player!: Player
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private trees!: Phaser.GameObjects.Group
  private items!: Phaser.GameObjects.Group
  private oceanLayer!: Phaser.Tilemaps.TilemapLayer
  private map!: Phaser.Tilemaps.Tilemap

  // colliders
  public playerTreeCollider!: Physics.Arcade.Collider
  public treeBeingHit!: PalmTree
  public coconuts: Coconut[] = []
  private crab!: Crab

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
    this.initTilemap()
    this.initPlayer()
    this.initPlants()
  }

  initTilemap() {
    this.map = this.make.tilemap({ key: 'starter-island' })
    const tileset = this.map.addTilesetImage('beach-tiles', 'tiles')
    this.oceanLayer = this.map.createLayer('Ocean', tileset)
    this.oceanLayer.setCollisionByProperty({ collides: true })
    this.map.createLayer('Ground', tileset)
  }

  initPlayer() {
    this.crab = new Crab(this, { x: 300, y: 300, textureKey: 'crab' })
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
    this.crab.update()
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
