export interface IAccountParams {
  name: string,
  description: string,
  contactEmail: string,
}

export interface IAccountBase {
  name: string,
  description: string,
}

export interface IAccountPrivate extends IAccountBase {
  contactEmail: string,
  maxNumberOfBlocks: number,
  notifications: boolean,
  numberOfErrors: number,
  uuid: string,
}

export interface IAccountPublic extends IAccountBase {
  baskets: string[],
  percentFull: number,
}
