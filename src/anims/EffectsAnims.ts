export const createEffectsAnims = (
  effects: { animation: any; name: string }[],
  anims: Phaser.Animations.AnimationManager
) => {
  effects.forEach((effect) => {
    const { animation, name } = effect
    anims.create({
      ...animation,
      frames: anims.generateFrameNames(name, {
        ...animation.frames,
      }),
    })
  })
}
