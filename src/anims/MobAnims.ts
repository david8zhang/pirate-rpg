export const createMobAnims = (
  mobs: { animations: any; animFrameName: string }[],
  anims: Phaser.Animations.AnimationManager
) => {
  mobs.forEach((mob) => {
    const { animations, animFrameName } = mob
    animations.forEach((anim) => {
      anims.create({
        ...anim,
        frames: anims.generateFrameNames(animFrameName, {
          ...anim.frames,
        }),
      })
    })
  })
}
