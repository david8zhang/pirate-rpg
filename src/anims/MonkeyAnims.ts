export const createmonkeyAnims = (anims: Phaser.Animations.AnimationManager) => {
  // Idle animations
  anims.create({
    key: 'monkey-idle-front',
    frames: anims.generateFrameNames('monkey', {
      start: 0,
      end: 3,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'monkey-idle-side',
    frames: anims.generateFrameNames('monkey', {
      start: 8,
      end: 11,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'monkey-idle-back',
    frames: anims.generateFrameNames('monkey', {
      start: 20,
      end: 23,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  // Walk animations
  anims.create({
    key: 'monkey-walk-front',
    frames: anims.generateFrameNames('monkey', {
      start: 12,
      end: 15,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'monkey-walk-side',
    frames: anims.generateFrameNames('monkey', {
      start: 4,
      end: 7,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  anims.create({
    key: 'monkey-walk-back',
    frames: anims.generateFrameNames('monkey', {
      start: 16,
      end: 19,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })

  // Hurt animations
  anims.create({
    key: 'monkey-hurt-front',
    frames: anims.generateFrameNames('monkey', {
      start: 45,
      end: 47,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'monkey-hurt-side',
    frames: anims.generateFrameNames('monkey', {
      start: 37,
      end: 37,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'monkey-hurt-back',
    frames: anims.generateFrameNames('monkey', {
      start: 41,
      end: 41,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })

  // Death animations
  anims.create({
    key: 'monkey-die-front',
    frames: anims.generateFrameNames('monkey', {
      start: 33,
      end: 36,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 5,
  })

  anims.create({
    key: 'monkey-die-side',
    frames: anims.generateFrameNames('monkey', {
      start: 37,
      end: 40,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 5,
  })

  anims.create({
    key: 'monkey-die-back',
    frames: anims.generateFrameNames('monkey', {
      start: 41,
      end: 44,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 5,
  })

  // Attack animations
  anims.create({
    key: 'monkey-attack-front',
    frames: anims.generateFrameNames('monkey', {
      start: 24,
      end: 26,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 5,
  })

  anims.create({
    key: 'monkey-attack-side',
    frames: anims.generateFrameNames('monkey', {
      start: 27,
      end: 29,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 5,
  })

  anims.create({
    key: 'monkey-attack-back',
    frames: anims.generateFrameNames('monkey', {
      start: 30,
      end: 32,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 5,
  })
}
