// Extarnal Libs
import { promisify } from 'util'
import { IsString, IsNotEmpty } from 'class-validator'
import redis = require('redis')
import uuidv4 = require('uuid/v4')

// External Files

// Interfaces
import { IAccount } from '../interfaces/account'

class Account {
  constructor(params: IAccount) {
    const { name, description, contactEmail } = params
    this.name = name
    this.description = description
    this.contactEmail = contactEmail
    this.uuid = uuidv4()
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

  public async store(): Promise<void> {
    try {
      const _client = redis.createClient()
      const _setAsync = promisify(_client.set).bind(_client)

      const _accountKey = Account.generateRedisKey(this.uuid)
      const _stringifiedAccount = this.generateRedisPayload()
      await _setAsync(_accountKey, _stringifiedAccount, 'EX', this.lifeSpan)
      _client.quit()
    } catch (error) {
      throw new Error(`Account - failed to store account: ${error.message}`)
    }
  }

  public static async get(uuid: string): Promise<IAccount> {
    try {
      const _client = redis.createClient()
      const _getAsync = promisify(_client.get).bind(_client)

      const _accountKey = Account.generateRedisKey(uuid)
      const _stringifiedAccount = await _getAsync(_accountKey)
      _client.quit()

      if (!_stringifiedAccount) {
        throw new Error('Account does not exist')
      }
  
      const _account = Account.convertRedisPayload(_stringifiedAccount)
      const _accountSanitized = Account.sanitize(_account)
      return _accountSanitized
    } catch (error) {
      throw new Error(`Account - failed to get account: ${error.message}`)
    }
  }

  private readonly lifeSpan = 432000

  private generateRedisPayload(): string {
    const _accountDetails = {
      name: this.name,
      description: this.description,
      contactEmail: this.contactEmail,
      uuid: this.uuid
    }
    return JSON.stringify(_accountDetails)
  }

  private static convertRedisPayload(stringifiedAccount: string): IAccount {
    try {
      const _account = JSON.parse(stringifiedAccount)
      return _account
    } catch (error) {
      throw new Error(`Account - failed to convert redis payload: ${error.message}`)
    }
  }

  private static generateRedisKey(uuid: string): string {
    try {
      return `account:${uuid}`
    } catch (error) {
      throw new Error(`Account - failed to generate rkey: ${error.message}`)
    }
  }

  private static sanitize(account: IAccount): IAccount {
    try {
      const { name, description, contactEmail } = account
      return { name, description, contactEmail }
    } catch (error) {
      throw new Error(`Account - failed to sanitize account: ${error.message}`)
    }
  }
}

export = Account
