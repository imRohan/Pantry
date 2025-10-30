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

const KEYS_PER_SCAN_ITERATION = 1_000_000

class Account {

  @IsNotEmpty()
  @IsString()
  private name: string
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
  @IsUUID('4')
  private uuid: string

  // Constants
  private readonly lifeSpanDays = Number(process.env.ACCOUNT_LIFESPAN)
  private readonly lifeSpan = Number(86400 * this.lifeSpanDays)
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
  }


  public static async get(uuid: string): Promise<Account> {
    const _accountKey = Account.generateRedisKey(uuid)

    const _stringifiedAccount = await dataStore.get(_accountKey)

    if (!_stringifiedAccount) {
      throw new Error(`pantry with id: ${uuid} not found`)
    }

    const _accountParams = Account.convertRedisPayload(_stringifiedAccount)
    const _accountObject = new Account(_accountParams)

    await _accountObject.refreshTTL()

    return _accountObject
  }

  public static async getTotalNumber(): Promise<number> {
    // eslint-disable-next-line max-len
    const _pattern = 'account:*-*-*-*-[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9]'
    let _total = 0
    let _nextCursor = 0

    do {
      const [_cursor, _results] = await dataStore.scan(_nextCursor, _pattern, KEYS_PER_SCAN_ITERATION)
      _total += _results.length
      _nextCursor = parseInt(_cursor, 10)
    } while (_nextCursor !== 0)

    return _total
  }

  private static convertRedisPayload(stringifiedAccount: string): IAccountPrivate {
    const _account = JSON.parse(stringifiedAccount)
    return _account
  }

  private static generateRedisKey(uuid: string): string {
    return `account:${uuid}`
  }

  public async update(newData: Partial<IAccountUpdateParams>): Promise<void> {
    const { name, description, notifications } = newData

    this.name = name ?? this.name
    this.description = description ?? this.description
    this.notifications = notifications ?? this.notifications

    await this.store()
  }

  public async store(): Promise<string> {
    const _errors = await validate(this)
    if (_errors.length > 0) {
      throw new Error(`Validation failed: ${_errors}`)
    }

    const _accountKey = Account.generateRedisKey(this.uuid)
    const _stringifiedAccount = this.generateRedisPayload()

    await dataStore.set(_accountKey, _stringifiedAccount, this.lifeSpan)

    return this.uuid
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

  public async checkIfFull(): Promise<boolean> {
    const _blocks = await this.getBlocks()
    const _isFull = _blocks.length === this.maxNumberOfBlocks
    return _isFull
  }

  public async delete(): Promise<void> {
    const _accountKey = Account.generateRedisKey(this.uuid)
    await dataStore.remove(_accountKey)
  }

  public async refreshTTL(): Promise<void> {
    await this.store()
  }

  public async getBlocks(): Promise<IBlockInfo[]> {
    const _accountKey = Account.generateRedisKey(this.uuid)
    const _blockKeys = await dataStore.find(`${_accountKey}::block:*`)
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
}

export default Account
