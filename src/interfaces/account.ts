export interface IAccount {
  name: string,
  description: string,
  contactEmail: string,
  notifications: boolean,
  maxNumberOfBlocks: number,
  blocks: string[],
  uuid?: string,
}
