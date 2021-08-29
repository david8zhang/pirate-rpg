export const createShipAnims = (
  ships: { animations: any; animFrameName: string }[],
  anims: Phaser.Animations.AnimationManager
) => {
  ships.forEach((ship) => {
    const { animations, animFrameName } = ship
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
