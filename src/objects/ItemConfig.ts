export enum ItemTypes {
  weapon = 'WEAPON',
  armor = 'ARMOR',
  resource = 'RESOURCE',
  particle = 'PARTICLE',
  structure = 'STRUCTURE',
  consumable = 'CONSUMABLE',
  ship = 'SHIP',
}

export interface ItemConfig {
  name: string
  image: string
  description: string
  type: ItemTypes
  inWorldImage?: string
  inWorldImageSet?: any
  recipe?: any
  effects?: any
  stats?: any
}
