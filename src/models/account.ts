// Extarnal Libs
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
  validate,
} from 'class-validator'
import redis = require('redis')
import { promisify } from 'util'
import uuidv4 = require('uuid/v4')

// External Files

// Interfaces
import { IAccount } from '../interfaces/account'

class Account {
  public static async checkIfExists(uuid: string): Promise<boolean> {
    try {
      const _account = await Account.get(uuid)
      return _account ? true : false
    } catch (error) {
      return false
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
        throw new Error('account does not exist')
      }

      const _account = Account.convertRedisPayload(_stringifiedAccount)
      const _accountSanitized = Account.sanitize(_account)
      return _accountSanitized
    } catch (error) {
      throw new Error(`failed to get account: ${error.message}`)
    }
  }

  public static async addBlock(uuid: string, blockName: string): Promise<void> {
    try {
      const _account = await Account.get(uuid)
      const { blocks } = _account

      // Add the existing blocks to updated account, along with the current uuid
      const _updatedBlocks = [ ...blocks, blockName ]
      _account.blocks = _updatedBlocks
      _account.uuid = uuid

      const _updatedAccount = new Account(_account)
      await _updatedAccount.store()
    } catch (error) {
      throw new Error(`failed to add block to account: ${error.message}`)
    }
  }

  public static async removeBlock(uuid: string, blockName: string): Promise<void> {
    try {
      const _account = await Account.get(uuid)
      const { blocks } = _account

      // Remove the block in question
      const _updatedBlocks = blocks.filter((name) => name !== blockName)
      _account.blocks = _updatedBlocks
      _account.uuid = uuid

      const _updatedAccount = new Account(_account)
      await _updatedAccount.store()
    } catch (error) {
      throw new Error(`failed to add block to account: ${error.message}`)
    }
  }

  private static convertRedisPayload(stringifiedAccount: string): IAccount {
    try {
      const _account = JSON.parse(stringifiedAccount)
      return _account
    } catch (error) {
      throw new Error(`failed to convert redis payload: ${error.message}`)
    }
  }

  private static generateRedisKey(uuid: string): string {
    try {
      return `account:${uuid}`
    } catch (error) {
      throw new Error(`failed to generate rkey: ${error.message}`)
    }
  }

  private static sanitize(account: IAccount): IAccount {
    try {
      const { name, description, contactEmail, notifications, blocks } = account
      return { name, description, contactEmail, notifications, blocks }
    } catch (error) {
      throw new Error(`failed to sanitize account: ${error.message}`)
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
  @IsNotEmpty()
  @IsArray()
  public blocks: string[]
  @IsUUID('4')
  public uuid: string

  // Constants
  private readonly lifeSpan = 432000

  constructor(params: IAccount) {
    const { name, description, contactEmail, notifications, blocks, uuid } = params
    this.name = name
    this.description = description
    this.contactEmail = contactEmail
    this.notifications = notifications ?? false
    this.blocks = blocks ?? []
    this.uuid = uuid ?? uuidv4()
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
      blocks: this.blocks,
      uuid: this.uuid,
    }
    return JSON.stringify(_accountDetails)
  }
}

export = Account
