import Player, { Direction } from '../Player'
import { State } from '../../lib/StateMachine'

export class AttackState extends State {
  enter(cursors: Phaser.Types.Input.Keyboard.CursorKeys, player: Player) {
    player.setVelocity(0)
    const weapon = player.getWeapon()
    if (weapon && weapon.isEquipped) {
      player.anims.play(`player-punch-down`)
    } else {
      player.anims.play(`player-punch-${player.getAnimDirection(player.direction)}`)
    }
    this.adjustColliderOffset(player)
  }

  adjustColliderOffset(player: Player) {
    const weapon = player.getWeapon()
    if (weapon && weapon.isEquipped) {
      weapon.tweenWeaponAttack()
    }
    switch (player.direction) {
      case Direction.DOWN: {
        player.body.offset.y += 10
        player.once('animationcomplete', () => {
          player.body.offset.y -= 10
          this.stateMachine.transition('idle')
        })
        break
      }
      case Direction.UP: {
        player.body.offset.y -= 10
        player.once('animationcomplete', () => {
          player.body.offset.y += 10
          this.stateMachine.transition('idle')
        })
        break
      }
      default:
        player.body.offset.x += 10
        player.once('animationcomplete', () => {
          player.body.offset.x -= 10
          this.stateMachine.transition('idle')
        })
        break
    }
  }
}
