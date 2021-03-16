import Player from '../../characters/Player'
import { State } from '../StateMachine'

export class AttackState extends State {
  enter(cursors: Phaser.Types.Input.Keyboard.CursorKeys, player: Player) {
    player.setVelocity(0)
    player.anims.play(`player-punch-${player.getAnimDirection(player.direction)}`)
    player.body.offset.x += 10
    player.once('animationcomplete', () => {
      player.body.offset.x = 12
      this.stateMachine.transition('idle')
    })
  }
}
