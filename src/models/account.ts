// Extarnal Libs
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  validate,
} from 'class-validator'
import uuidv4 = require('uuid/v4')

// External Files
import * as dataStore from '../services/dataStore'

// Interfaces
import { IAccountPrivate, IAccountPublic, IAccountUpdateParams } from '../interfaces/account'
import { IBlockInfo } from '../interfaces/block'

class Account {
  public static readonly lifeSpanDays = Number(process.env.ACCOUNT_LIFESPAN)
  public static readonly lifeSpan = Number(86400 * this.lifeSpanDays)

  @IsUUID('4')
  public uuid: string
  @IsNotEmpty()
  @IsString()
  public name: string
  @IsNotEmpty()
  @IsString()
  private description: string
  @IsNotEmpty()
  @IsEmail()
  private contactEmail: string
  @IsNotEmpty()
  @IsBoolean()
  private notifications: boolean
  @IsNotEmpty()
  @IsNumber()
  private maxNumberOfBlocks: number
  @IsNotEmpty()
  @IsArray()
  private errors: string[]
  @IsNotEmpty()
  @IsString()
  private redisKey: string

  // Constants
  private readonly defaultMaxNumberOfBlocks = 100

  public constructor(params: any) {
    const { name, description, contactEmail, notifications, uuid, maxNumberOfBlocks, errors } = params
    this.name = name
    this.description = description
    this.contactEmail = contactEmail
    this.notifications = notifications ?? true
    this.maxNumberOfBlocks = maxNumberOfBlocks ?? this.defaultMaxNumberOfBlocks
    this.errors = errors ?? []
    this.uuid = uuid ?? uuidv4()
    this.redisKey = `account:${this.uuid}`
  }


  public static async get(uuid: string): Promise<Account> {
    const _account = new Account({ uuid })
    await _account.hydrate()
    await _account.refreshTTL()
    return _account
  }

  public static async getTotalNumber(): Promise<number> {
    // eslint-disable-next-line max-len
    const _pattern = 'account:*-*-*-*-[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9]'
    let _total = 0
    let _nextCursor = 0

    do {
      const [_cursor, _results] = await dataStore.scan(_nextCursor, _pattern, 1000)
      _total += _results.length
      _nextCursor = parseInt(_cursor, 10)
    } while (_nextCursor !== 0)

    return _total
  }

  public async update(newData: Partial<IAccountUpdateParams>): Promise<void> {
    const { name, description, notifications } = newData

    this.name = name ?? this.name
    this.description = description ?? this.description
    this.notifications = notifications ?? this.notifications

    await this.store()
  }

  public async store(): Promise<void> {
    const _errors = await validate(this)
    if (_errors.length > 0) {
      throw new Error(`Validation failed: ${_errors}`)
    }

    const _stringifiedAccount = this.generateRedisPayload()
    await dataStore.set(this.redisKey, _stringifiedAccount, Account.lifeSpan)
  }

  public async sanitize(): Promise<IAccountPublic> {
    const _baskets = await this.getBlocks()
    const _percentFull = Math.round((_baskets.length / this.maxNumberOfBlocks) * 100)

    const _sanitizedItems: IAccountPublic = {
      name: this.name,
      description: this.description,
      errors: this.errors,
      notifications: this.notifications,
      percentFull: _percentFull,
      baskets: _baskets,
    }

    return _sanitizedItems
  }

  public async verifyIfFull(): Promise<boolean> {
    const _blocks = await this.getBlocks()
    const _isFull = _blocks.length === this.maxNumberOfBlocks
    if (_isFull) {
      throw new Error('maximum storage limit has been reached')
    } else {
      return true
    }
  }

  public async delete(): Promise<void> {
    await dataStore.remove(this.redisKey)
  }

  public async refreshTTL(): Promise<void> {
    await dataStore.refreshTTL(this.redisKey, Account.lifeSpan)
  }

  public async getBlocks(): Promise<IBlockInfo[]> {
    const _blockKeys = await dataStore.find(`${this.redisKey}::block:*`)
    const _blocks: IBlockInfo[] = await Promise.all(_blockKeys.map(async (key) => {
      const _ttl = await dataStore.ttl(key)
      const _sanitizedName = key.split(':')[4]
      return({name: _sanitizedName, ttl: _ttl})
    }))

    return(_blocks)
  }

  public async saveError(message: string): Promise<void> {
    const _date = new Date().toLocaleDateString()
    const _errorString = `${_date} - ${message}`

    this.errors = [...this.errors, _errorString]
    await this.store()
  }

  private generateRedisPayload(): string {
    const _accountDetails: IAccountPrivate = {
      name: this.name,
      description: this.description,
      contactEmail: this.contactEmail,
      notifications: this.notifications,
      maxNumberOfBlocks: this.maxNumberOfBlocks,
      errors: this.errors,
      uuid: this.uuid,
    }
    return JSON.stringify(_accountDetails)
  }

  private async hydrate(): Promise<void> {
    const _stringifiedAccount = await dataStore.get(this.redisKey)

    if (!_stringifiedAccount) {
      throw new Error(`pantry with id: ${this.uuid} not found`)
    }

    const _accountParams: IAccountPrivate = JSON.parse(_stringifiedAccount)
    const { name, description, contactEmail, notifications, maxNumberOfBlocks, errors } = _accountParams
    this.name = name
    this.description = description
    this.contactEmail = contactEmail
    this.notifications = notifications
    this.maxNumberOfBlocks = maxNumberOfBlocks
    this.errors = errors
  }
}

export default Account
