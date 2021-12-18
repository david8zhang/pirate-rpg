import Player, { Direction } from '../Player'
import { State } from '../../lib/StateMachine'

export class MoveState extends State {
  execute(cursors: Phaser.Types.Input.Keyboard.CursorKeys, player: Player) {
    const leftDown = cursors.left?.isDown
    const rightDown = cursors.right?.isDown
    const upDown = cursors.up?.isDown
    const downDown = cursors.down?.isDown
    const spaceDown = cursors.space?.isDown

    if (player.canMove()) {
      const speed = 100
      if (spaceDown && player.canAttack()) {
        this.stateMachine.transition('attack')
        return
      }

      if (!(leftDown || rightDown || upDown || downDown)) {
        this.stateMachine.transition('idle')
        return
      }

      if (leftDown) {
        player.scaleX = -1
        player.body.offset.x = 27
        player.direction = Direction.LEFT
        player.setVelocity(-speed, 0)
      }
      if (rightDown) {
        player.scaleX = 1
        player.body.offset.x = 12
        player.direction = Direction.RIGHT
        player.setVelocity(speed, 0)
      }
      if (upDown) {
        player.direction = Direction.UP
        player.setVelocity(0, -speed)
      }
      if (downDown) {
        player.direction = Direction.DOWN
        player.setVelocity(0, speed)
      }

      if (player.getIsSubmerged()) {
        player.anims.play(`player-swim-${player.getAnimDirection(player.direction)}`, true)
      } else {
        player.anims.play(`player-walk-${player.getAnimDirection(player.direction)}`, true)
      }
    }
  }
}
