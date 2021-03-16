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
    key: 'player-walk-side',
    frames: anims.generateFrameNames('player', {
      start: 0,
      end: 3,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'player-walk-down',
    frames: anims.generateFrameNames('player', {
      start: 7,
      end: 10,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'player-walk-up',
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

  anims.create({
    key: 'player-punch-side',
    frames: anims.generateFrameNames('player', {
      start: 24,
      end: 27,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'player-punch-up',
    frames: anims.generateFrameNames('player', {
      start: 32,
      end: 35,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'player-punch-down',
    frames: anims.generateFrameNames('player', {
      start: 28,
      end: 31,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })
}
