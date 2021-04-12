const itemsList = [
  'Stone Axe',
  'Stone Spear',
  'Crab Axe',
  'Crab Spear',
  'Monkey Vest',
  'Stone Axe',
  'Stone Spear',
  'Crab Axe',
  'Crab Spear',
  'Monkey Vest',
  'Stone Axe',
  'Stone Spear',
  'Crab Axe',
  'Crab Spear',
  'Monkey Vest',
  'Stone Axe',
  'Stone Spear',
  'Crab Axe',
  'Crab Spear',
  'Monkey Vest',
  'Stone Axe',
  'Stone Spear',
  'Crab Axe',
  'Crab Spear',
  'Monkey Vest',
  'Stone Axe',
  'Stone Spear',
  'Crab Axe',
  'Crab Spear',
  'Monkey Vest',
]

export class CraftingMenu {
  private static X_POS: number = 350
  private static Y_POS: number = 10
  private static WIDTH: number = 250
  private static HEIGHT: number = 300
  private rectangle: Phaser.GameObjects.Rectangle
  private craftableItemsListWrapper: Phaser.GameObjects.Rectangle
  private itemToCraftDescription: Phaser.GameObjects.Rectangle

  private startIndex: number = 0

  public scene: Phaser.Scene
  public craftableItemsList: Phaser.GameObjects.Text[] = []
  public currHighlight: Phaser.GameObjects.Rectangle

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.rectangle = scene.add
      .rectangle(
        CraftingMenu.X_POS - 5,
        CraftingMenu.Y_POS - 5,
        CraftingMenu.WIDTH,
        CraftingMenu.HEIGHT,
        0x795644,
        1
      )
      .setOrigin(0, 0)

    const headerText = scene.add
      .text(CraftingMenu.X_POS + CraftingMenu.WIDTH / 2, CraftingMenu.Y_POS + 10, 'Crafting', {
        fontFamily: 'GraphicPixel',
        fontSize: '20px',
      })
      .setOrigin(0.5)

    this.craftableItemsListWrapper = scene.add
      .rectangle(
        CraftingMenu.X_POS,
        CraftingMenu.Y_POS + headerText.height + 5,
        CraftingMenu.WIDTH / 2.5,
        CraftingMenu.HEIGHT - headerText.height - 15,
        0x000000,
        0.5
      )
      .setOrigin(0, 0)

    this.itemToCraftDescription = scene.add
      .rectangle(
        CraftingMenu.X_POS + this.craftableItemsListWrapper.width + 5,
        CraftingMenu.Y_POS + headerText.height + 5,
        CraftingMenu.WIDTH - CraftingMenu.WIDTH / 2.5 - 15,
        CraftingMenu.HEIGHT - headerText.height - 15,
        0x000000,
        0.5
      )
      .setOrigin(0, 0)

    this.currHighlight = scene.add
      .rectangle(0, 0, this.craftableItemsListWrapper.width, 15, 0xffff00, 0.5)
      .setOrigin(0, 0)
      .setVisible(false)
    this.renderCraftableItems(itemsList)
  }

  renderCraftableItems(items: string[]) {
    const startingX = this.craftableItemsListWrapper.x + 5
    let yPos = this.craftableItemsListWrapper.y + 5

    const listCutoffPoint =
      this.craftableItemsListWrapper.height + this.craftableItemsListWrapper.y - 5
    items.forEach((item) => {
      if (yPos < listCutoffPoint) {
        const text = this.scene.add.text(startingX, yPos, item, {
          fontFamily: 'GraphicPixel',
          fontSize: '10px',
        })
        this.craftableItemsList.push()
        yPos += text.height + 5
        text.setInteractive()
        text.on('pointerdown', (obj) => {
          this.currHighlight.setX(text.x - 5)
          this.currHighlight.setY(text.y - 2)
          this.currHighlight.setVisible(true)
        })
      }
    })
  }
}
