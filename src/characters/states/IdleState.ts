import Player from '../Player'
import { State } from '../../lib/StateMachine'

export class IdleState extends State {
  enter(cursors: Phaser.Types.Input.Keyboard.CursorKeys, player: Player) {
    player.setVelocity(0)
    player.anims.play(`player-idle-${player.getAnimDirection(player.direction)}`)
  }

  execute(cursors: Phaser.Types.Input.Keyboard.CursorKeys, player: Player) {
    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown
    const spaceDown = cursors.space?.isDown
    if (leftDown || upDown || downDown || rightDown) {
      this.stateMachine.transition('move')
      return
    }
    if (spaceDown) {
      this.stateMachine.transition('attack')
      return
    }
  }
}
