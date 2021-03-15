import Phaser from 'phaser'

export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'player-idle-down',
    frames: anims.generateFrameNames('player', {
      start: 5,
      end: 7,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })
  anims.create({
    key: 'player-run-side',
    frames: anims.generateFrameNames('player', {
      start: 0,
      end: 3,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'player-run-down',
    frames: anims.generateFrameNames('player', {
      start: 7,
      end: 10,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'player-run-up',
    frames: anims.generateFrameNames('player', {
      start: 20,
      end: 23,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'player-idle-side',
    frames: anims.generateFrameNames('player', {
      start: 12,
      end: 15,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'player-idle-up',
    frames: anims.generateFrameNames('player', {
      start: 16,
      end: 16,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })
}
