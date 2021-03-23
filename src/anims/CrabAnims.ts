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
}
