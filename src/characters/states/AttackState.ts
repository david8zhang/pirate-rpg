import Player, { Direction } from '../Player'
import { State } from '../../lib/StateMachine'

export class AttackState extends State {
  enter(cursors: Phaser.Types.Input.Keyboard.CursorKeys, player: Player) {
    player.setVelocity(0)
    const weapon = player.getWeapon()
    if (weapon && weapon.isEquipped) {
      if (player.direction === Direction.LEFT || player.direction === Direction.RIGHT) {
        player.anims.play(`player-weapon-swing-side`)
      } else if (player.direction === Direction.UP) {
        player.anims.play('player-punch-up')
      } else if (player.direction === Direction.DOWN) {
        player.anims.play(`player-punch-down`)
      }
    } else {
      player.anims.play(`player-punch-${player.getAnimDirection(player.direction)}`)
    }
    this.adjustColliderOffset(player)
  }

  adjustColliderOffset(player: Player) {
    const weapon = player.getWeapon()
    let offset = 10
    if (weapon && weapon.isEquipped) {
      weapon.playAttackAnimation()
      offset = 0
    }
    switch (player.direction) {
      case Direction.DOWN: {
        player.body.offset.y += offset
        player.once('animationcomplete', () => {
          player.body.offset.y -= offset
          this.stateMachine.transition('idle')
        })
        break
      }
      case Direction.UP: {
        player.body.offset.y -= offset
        player.once('animationcomplete', () => {
          player.body.offset.y += offset
          this.stateMachine.transition('idle')
        })
        break
      }
      default:
        player.body.offset.x += offset
        player.once('animationcomplete', () => {
          player.body.offset.x -= offset
          this.stateMachine.transition('idle')
        })
        break
    }
  }
}
