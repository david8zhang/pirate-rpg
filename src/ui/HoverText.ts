import Game from '../scenes/Game'

export class HoverText {
  text: Phaser.GameObjects.Text
  isVisible: boolean = false
  constructor(scene: Game, x: number, y: number) {
    this.text = scene.add.text(x, y, '', {
      fontSize: '10px',
      fontFamily: 'GraphicPixel',
      color: 'white',
      strokeThickness: 1,
      stroke: 'black',
    })
    this.text.setName('UI')
    this.text.setVisible(true)
    this.text.setDepth(1000)
  }

  showText(text: string, x: number, y: number) {
    this.text.setText(text)
    this.text.x = x
    this.text.y = y
    this.isVisible = true
    this.text.setVisible(true)
  }

  setTextSize(size: number) {
    this.text.setFontSize(size)
  }

  hide() {
    this.isVisible = false
    this.text.setVisible(false)
  }
}
