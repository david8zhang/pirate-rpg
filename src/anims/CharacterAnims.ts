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
    frames: [
      {
        key: 'player',
        frame: '35.png',
      },
      {
        key: 'player',
        frame: '35.png',
      },
      {
        key: 'player',
        frame: '32.png',
      },
      {
        key: 'player',
        frame: '32.png',
      },
    ],
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'player-punch-down',
    frames: [
      {
        key: 'player',
        frame: '31.png',
      },
      {
        key: 'player',
        frame: '30.png',
      },
      {
        key: 'player',
        frame: '29.png',
      },
      {
        key: 'player',
        frame: '28.png',
      },
    ],
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'player-weapon-swing-side',
    frames: anims.generateFrameNames('player', {
      start: 37,
      end: 39,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 8,
  })

  anims.create({
    key: 'player-swim-down',
    frames: anims.generateFrameNames('player', {
      start: 40,
      end: 42,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 8,
  })

  anims.create({
    key: 'player-swim-side',
    frames: anims.generateFrameNames('player', {
      start: 43,
      end: 45,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 8,
  })

  anims.create({
    key: 'player-swim-up',
    frames: anims.generateFrameNames('player', {
      start: 46,
      end: 48,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 8,
  })
}
