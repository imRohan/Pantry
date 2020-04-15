// Extarnal Libs

// External Files
import Account = require('../models/account')
import logService = require('../services/logger')

// Interfaces
import { IAccount, IAccountPublic } from '../interfaces/account'

// Logger setup
const logger = new logService('Account Controller')

class AccountController {
  public static async create(params: IAccount): Promise<string> {
    try {
      const _account = new Account(params)
      const _accountUUID = await _account.store()

      logger.info('Account created')
      return _accountUUID
    } catch (error) {
      logger.error(`Account creation failed: ${error.message}`)
      throw error
    }
  }

  public static async get(uuid: string): Promise<IAccountPublic> {
    try {
      const _account = await Account.get(uuid)
      const _accountDetails = _account.sanitize()

      logger.info('Account retrieved')
      return _accountDetails
    } catch (error) {
      logger.error(`Account retrieval failed: ${error.message}`)
      throw error
    }
  }
}

export = AccountController
