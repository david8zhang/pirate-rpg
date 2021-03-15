import Phaser from 'phaser'
import { Constants } from '~/utils/Constants'
import { debugDraw } from '~/utils/debug'
import { createCharacterAnims } from '../anims/CharacterAnims'
import '../characters/Player'
import Player from '../characters/Player'

export default class Game extends Phaser.Scene {
  private player!: Player
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  constructor() {
    super('game')
  }

  preload(): void {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create(): void {
    createCharacterAnims(this.anims)

    const map = this.make.tilemap({ key: 'starter-island' })
    const tileset = map.addTilesetImage('beach-tiles', 'tiles')
    const oceanLayer = map.createLayer('Ocean', tileset)
    oceanLayer.setCollisionByProperty({ collides: true })
    map.createLayer('Ground', tileset)

    this.player = this.add.player(256, 256, 'player')
    this.physics.add.collider(this.player, oceanLayer)

    this.cameras.main.setBounds(0, 0, Constants.BG_WIDTH, Constants.BG_HEIGHT)
    this.cameras.main.startFollow(this.player, true)
  }

  update() {
    this.player.update(this.cursors)
  }
}
