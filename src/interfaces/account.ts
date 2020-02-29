export interface IAccountBase {
  blocks: string[],
  maxNumberOfBlocks: number,
  name: string,
  description: string,
  contactEmail: string,
}

export interface IAccountPrivate extends IAccountBase {
  notifications: boolean,
  uuid?: string,
}
