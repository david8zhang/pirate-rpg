import { ItemBox } from './InventoryMenu'

export class EquipmentMenu {
  private static MENU_Y_POS = 200
  private static MENU_X_POS = 68
  private static PADDING = 5

  public scene: Phaser.Scene
  public headBox: ItemBox
  public weaponBox: ItemBox
  public chestBox: ItemBox
  public pantsBox: ItemBox
  public isVisible: boolean = false
  public onItemClick: Function | null = null

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.headBox = new ItemBox(scene, EquipmentMenu.MENU_X_POS, EquipmentMenu.MENU_Y_POS, true)
    this.chestBox = new ItemBox(
      scene,
      this.headBox.panel.x,
      EquipmentMenu.MENU_Y_POS + this.headBox.panel.height + EquipmentMenu.PADDING,
      true
    )
    this.weaponBox = new ItemBox(
      scene,
      this.chestBox.panel.x + this.chestBox.panel.width + EquipmentMenu.PADDING,
      this.chestBox.panel.y,
      true
    )
    this.pantsBox = new ItemBox(
      scene,
      this.chestBox.panel.x,
      this.chestBox.panel.y + this.chestBox.panel.height + EquipmentMenu.PADDING,
      true
    )

    this.chestBox.setVisible(this.isVisible)
    this.headBox.setVisible(this.isVisible)
    this.weaponBox.setVisible(this.isVisible)
    this.pantsBox.setVisible(this.isVisible)

    this.chestBox.itemClickHandler = () => {
      this.onUnequipItem(this.chestBox)
    }
    this.headBox.itemClickHandler = () => {
      this.onUnequipItem(this.headBox)
    }
    this.weaponBox.itemClickHandler = () => {
      this.onUnequipItem(this.weaponBox)
    }
    this.pantsBox.itemClickHandler = () => {
      this.onUnequipItem(this.pantsBox)
    }
  }

  toggleVisible() {
    this.isVisible = !this.isVisible
    this.chestBox.setVisible(this.isVisible)
    this.headBox.setVisible(this.isVisible)
    this.weaponBox.setVisible(this.isVisible)
    this.pantsBox.setVisible(this.isVisible)
  }

  onUnequipItem(itemBox: ItemBox) {
    if (this.onItemClick) {
      this.onItemClick(itemBox)
    }
    itemBox.removeItem()
  }
}
