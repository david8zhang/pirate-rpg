import Player from '../Player'
import { State } from '../../lib/StateMachine'

export class IdleState extends State {
  enter(cursors: Phaser.Types.Input.Keyboard.CursorKeys, player: Player) {
    player.setVelocity(0)
    const direction = player.getAnimDirection(player.direction)
    if (player.getIsSubmerged()) {
      player.anims.play(`player-swim-${direction}`)
    } else {
      player.anims.play(`player-idle-${direction}`)
    }
  }

  execute(cursors: Phaser.Types.Input.Keyboard.CursorKeys, player: Player) {
    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown
    const spaceDown = Phaser.Input.Keyboard.JustDown(cursors.space)
    if (leftDown || upDown || downDown || rightDown) {
      this.stateMachine.transition('move')
      return
    }
    if (spaceDown) {
      if (player.structureToBePlaced) {
        player.placeStructure()
        return
      }
      if (player.shipToBePlaced) {
        player.placeShip()
        return
      }
      if (player.getCurrState() !== 'attack' && player.canAttack()) {
        this.stateMachine.transition('attack')
        return
      }
    }
  }
}
