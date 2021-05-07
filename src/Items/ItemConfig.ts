export enum ItemTypes {
  weapon = 'WEAPON',
  armor = 'ARMOR',
  resource = 'RESOURCE',
  particle = 'PARTICLE',
  structure = 'STRUCTURE',
}

export interface ItemConfig {
  name: string
  image: string
  description: string
  type: ItemTypes
  recipe?: any
  stats?: any
}