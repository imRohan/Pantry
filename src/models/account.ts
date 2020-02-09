// Extarnal Libs
import { IsBoolean, IsNotEmpty, IsString, validate } from 'class-validator'
import redis = require('redis')
import { promisify } from 'util'
import uuidv4 = require('uuid/v4')

// External Files

// Interfaces
import { IAccount } from '../interfaces/account'

class Account {

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
      const { name, description, contactEmail, notifications } = account
      return { name, description, contactEmail, notifications }
    } catch (error) {
      throw new Error(`Account - failed to sanitize account: ${error.message}`)
    }
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
  @IsNotEmpty()
  @IsBoolean()
  public notifications: boolean
  public uuid: string

  // Constants
  private readonly lifeSpan = 432000

  constructor(params: IAccount) {
    const { name, description, contactEmail, notifications } = params
    this.name = name
    this.description = description
    this.contactEmail = contactEmail
    this.notifications = notifications ?? false
    this.uuid = uuidv4()
  }

  public async store(): Promise<void> {
    try {
      // Validate the account object
      const _errors = await validate(this)
      if (_errors.length > 0) {
        throw new Error(`Validation failed: ${_errors}`)
      }

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

  private generateRedisPayload(): string {
    const _accountDetails: IAccount = {
      name: this.name,
      description: this.description,
      contactEmail: this.contactEmail,
      notifications: this.notifications,
      uuid: this.uuid,
    }
    return JSON.stringify(_accountDetails)
  }
}

export = Account
