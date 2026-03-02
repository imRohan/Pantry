export interface IPlunkEvent {
  email: string,
  event: string,
  data: {
    pantryID: string,
    pantryName: string
  }
}
