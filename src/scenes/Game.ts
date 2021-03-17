import Phaser, { GameObjects, Physics } from 'phaser'
import PalmTree from '~/plants/PalmTree'
import { Constants } from '~/utils/Constants'
import { createCharacterAnims } from '../anims/CharacterAnims'
import '../characters/Player'
import Player from '../characters/Player'

export default class Game extends Phaser.Scene {
  private player!: Player
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private trees!: Phaser.GameObjects.Group
  private oceanLayer!: Phaser.Tilemaps.TilemapLayer
  private map!: Phaser.Tilemaps.Tilemap

  // colliders
  public playerTreeCollider!: Physics.Arcade.Collider
  public treeBeingHit!: PalmTree

  constructor() {
    super('game')
  }

  preload(): void {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create(): void {
    createCharacterAnims(this.anims)
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
    this.trees.getChildren().forEach((child: GameObjects.GameObject) => {
      const palmTree = child as PalmTree
      if (palmTree.y + 10 < this.player.y) {
        palmTree.setDepth(this.player.depth - 1)
      } else {
        palmTree.setDepth(this.player.depth + 1)
      }
    })
  }
}
