export interface IAccount {
  name: string,
  description: string,
  contactEmail: string,
}

export interface IAccountPrivate extends IAccount {
  blocks: string[],
  maxNumberOfBlocks: number,
  notifications: boolean,
  uuid?: string,
}

export interface IAccountPublic extends IAccount {
  baskets: string[],
}
