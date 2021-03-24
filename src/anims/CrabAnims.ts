export const createCrabAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'crab-idle',
    frames: anims.generateFrameNames('crab', {
      start: 0,
      end: 2,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })
  anims.create({
    key: 'crab-walk-side',
    frames: anims.generateFrameNames('crab', {
      start: 4,
      end: 6,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })
}
