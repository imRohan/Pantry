// Extarnal Libs
import { IsString, IsNotEmpty } from 'class-validator'

// External Files

// Interfaces
import { IAccount } from '../interfaces/account'

class Account {
  constructor(params: IAccount) {
    const { name, description, contactEmail } = params
    this.name = name
    this.description = description
    this.contactEmail = contactEmail
    this.uuid = '12345'
  }

  @IsNotEmpty()
  @IsString()
  public name: string
  @IsNotEmpty()
  @IsString()
  public description: string
  @IsNotEmpty()
  @IsString()
  public contactEmail: string
  public uuid: string
}

export = Account
