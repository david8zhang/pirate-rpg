export const createCrabAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'crab-idle-front',
    frames: anims.generateFrameNames('crab', {
      start: 0,
      end: 2,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })
  anims.create({
    key: 'crab-walk-front',
    frames: anims.generateFrameNames('crab', {
      start: 4,
      end: 6,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'crab-walk-side',
    frames: anims.generateFrameNames('crab', {
      start: 14,
      end: 16,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'crab-idle-side',
    frames: anims.generateFrameNames('crab', {
      start: 10,
      end: 12,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })
  anims.create({
    key: 'crab-hurt-front',
    frames: anims.generateFrameNames('crab', {
      start: 8,
      end: 8,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'crab-die-front',
    frames: anims.generateFrameNames('crab', {
      start: 7,
      end: 9,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 5,
  })

  anims.create({
    key: 'crab-die-side',
    frames: anims.generateFrameNames('crab', {
      start: 16,
      end: 18,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 5,
  })
}
