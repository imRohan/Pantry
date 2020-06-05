export interface IAccountParams {
  name: string,
  description: string,
  contactEmail: string,
}

export interface IAccountUpdateParams {
  name: string,
  description: string,
  notifications: boolean,
}

export interface IAccountBase {
  name: string,
  description: string,
  notifications: boolean,
  errors: string[],
}

export interface IAccountPrivate extends IAccountBase {
  contactEmail: string,
  maxNumberOfBlocks: number,
  uuid: string,
}

export interface IAccountPublic extends IAccountBase {
  baskets: string[],
  percentFull: number,
}
