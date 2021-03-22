export const createGiantCrabAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'giant-crab-idle',
    frames: anims.generateFrameNames('giant-crab', {
      start: 0,
      end: 2,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 10,
  })
}
