// Extarnal Libs
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  validate,
} from 'class-validator'
import redis = require('redis')
import { promisify } from 'util'
import uuidv4 = require('uuid/v4')

// External Files

// Interfaces
import { IAccountBase, IAccountPrivate } from '../interfaces/account'

class Account {
  public static async checkIfExists(uuid: string): Promise<boolean> {
    try {
      const _account = await Account.get(uuid)
      return _account ? true : false
    } catch (error) {
      return false
    }
  }

  public static async get(uuid: string): Promise<Account> {
    try {
      const _client = redis.createClient()
      const _getAsync = promisify(_client.get).bind(_client)

      const _accountKey = Account.generateRedisKey(uuid)
      const _stringifiedAccount = await _getAsync(_accountKey)
      _client.quit()

      if (!_stringifiedAccount) {
        throw new Error(`nothing found for ${uuid}`)
      }

      const _accountParams = Account.convertRedisPayload(_stringifiedAccount)

      const _accountObject = new Account(_accountParams)
      return _accountObject
    } catch (error) {
      throw error
    }
  }

  public static async addBlock(uuid: string, blockName: string): Promise<void> {
    try {
      const _account = await Account.get(uuid)
      await _account.addBlock(blockName)
    } catch (error) {
      throw new Error(`failed to add: ${error.message}`)
    }
  }

  public static async removeBlock(uuid: string, blockName: string): Promise<void> {
    try {
      const _account = await Account.get(uuid)
      await _account.removeBlock(blockName)
    } catch (error) {
      throw new Error(`failed to remove: ${error.message}`)
    }
  }

  public static async checkIfFull(uuid: string): Promise<boolean> {
    try {
      const _account = await Account.get(uuid)
      const _isFull = _account.checkIfFull()

      return _isFull
    } catch (error) {
      throw new Error(`failed to check if full: ${error.message}`)
    }
  }

  private static convertRedisPayload(stringifiedAccount: string): IAccountPrivate {
    try {
      const _account = JSON.parse(stringifiedAccount)
      return _account
    } catch (error) {
      throw new Error(`failed to convert payload: ${error.message}`)
    }
  }

  private static generateRedisKey(uuid: string): string {
    try {
      return `account:${uuid}`
    } catch (error) {
      throw new Error(`failed to generate rkey: ${error.message}`)
    }
  }

  @IsNotEmpty()
  @IsString()
  private name: string
  @IsNotEmpty()
  @IsString()
  private description: string
  @IsNotEmpty()
  @IsString()
  private contactEmail: string
  @IsNotEmpty()
  @IsBoolean()
  private notifications: boolean
  @IsNotEmpty()
  @IsNumber()
  private maxNumberOfBlocks: number
  @IsNotEmpty()
  @IsArray()
  private blocks: string[]
  @IsUUID('4')
  private uuid: string

  // Constants
  private readonly lifeSpan = 432000
  private readonly defaultMaxNumberOfBlocks = 50

  constructor(params: any) {
    const { name, description, contactEmail, notifications, blocks, uuid } = params
    this.name = name
    this.description = description
    this.contactEmail = contactEmail
    this.notifications = notifications ?? false
    this.maxNumberOfBlocks = this.defaultMaxNumberOfBlocks
    this.blocks = blocks ?? []
    this.uuid = uuid ?? uuidv4()
  }

  public async store(): Promise<string> {
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

      return this.uuid
    } catch (error) {
      throw error
    }
  }

  public sanitize(): IAccountBase {
    try {
      const _sanitizedItems = {
        name: this.name,
        description: this.description,
        contactEmail: this.contactEmail,
        blocks: this.blocks,
        maxNumberOfBlocks: this.maxNumberOfBlocks,
      }
      return _sanitizedItems
    } catch (error) {
      throw new Error(`failed to sanitize: ${error.message}`)
    }
  }

  public async addBlock(blockName: string): Promise<void> {
    try {
      const _currentBlocks = this.blocks
      const _updatedBlocks = [..._currentBlocks, blockName]

      this.blocks = _updatedBlocks
      await this.store()
    } catch (error) {
      throw new Error(`failed to add block: ${error.message}`)
    }
  }

  public async removeBlock(blockName: string): Promise<void> {
    try {
      const _updatedBlocks = this.blocks.filter((name) => name !== blockName)

      this.blocks = _updatedBlocks
      await this.store()
    } catch (error) {
      throw new Error(`failed to remove block: ${error.message}`)
    }
  }

  public checkIfFull(): boolean {
    try {
      const _isFull = this.blocks.length === this.maxNumberOfBlocks
      return _isFull
    } catch (error) {
      throw new Error(`failed to remove block: ${error.message}`)
    }
  }

  private generateRedisPayload(): string {
    const _accountDetails: IAccountPrivate = {
      name: this.name,
      description: this.description,
      contactEmail: this.contactEmail,
      notifications: this.notifications,
      maxNumberOfBlocks: this.maxNumberOfBlocks,
      blocks: this.blocks,
      uuid: this.uuid,
    }
    return JSON.stringify(_accountDetails)
  }
}

export = Account
