import Game from '~/scenes/Game'
import { ALL_HARVESTABLES, Constants } from '~/utils/Constants'
import { MapGenerator } from './MapGenerator'
import { ObjectPlacer } from './ObjectPlacer'

export class Map {
  public mapSeed: number
  private scene: Game
  public spawnPos: { x: number; y: number }
  public tileMap: Phaser.Tilemaps.Tilemap
  public layers: Phaser.Tilemaps.TilemapLayer[] = []
  public harvestables: any[]

  constructor(scene: Game) {
    this.scene = scene
    const mapSeed = this.getSavedMapSeed()
    this.mapSeed = mapSeed
    const generatedMap = MapGenerator.getTileMap(mapSeed)
    this.spawnPos = Constants.getSpawnPosFromMap(generatedMap)
    const layerMapping = MapGenerator.splitIntoLayers(generatedMap)
    this.tileMap = this.scene.make.tilemap({
      height: Constants.GAME_HEIGHT,
      width: Constants.GAME_WIDTH,
      tileHeight: Constants.TILE_SIZE,
      tileWidth: Constants.TILE_SIZE,
    })
    const tileset = this.tileMap.addTilesetImage('beach-tiles', 'beach-tiles')
    const oceanLayer = this.createLayer('Ocean', layerMapping, tileset)
    const sandLayer = this.createLayer('Sand', layerMapping, tileset)
    const grassLayer = this.createLayer('Grass', layerMapping, tileset)
    oceanLayer.setCollisionByExclusion([-1])
    sandLayer.setCollisionByExclusion([-1])
    grassLayer.setCollisionByExclusion([-1])

    this.layers.push(oceanLayer)
    this.layers.push(sandLayer)
    this.layers.push(grassLayer)
    this.harvestables = ObjectPlacer.placeObjectsFromTilemap(ALL_HARVESTABLES, generatedMap)
  }

  createLayer(layerName: string, layerMapping: any, tileset: Phaser.Tilemaps.Tileset) {
    const newLayer = this.tileMap.createBlankLayer(layerName, tileset, 0, 0)
    newLayer.putTilesAt(layerMapping[layerName], 0, 0)
    return newLayer
  }

  getSavedMapSeed(): number {
    const rawSaveData = localStorage.getItem('saveFile')
    if (rawSaveData) {
      const saveFile = JSON.parse(rawSaveData)
      return saveFile.mapSeed
    }
    return Math.floor(Math.random() * 200)
  }
}
