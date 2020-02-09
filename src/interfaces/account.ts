export interface IAccount {
  name: string,
  description: string,
  contactEmail: string,
  notifications: boolean,
  blocks: string[],
  uuid?: string,
}
