// Extarnal Libs

// External Files
import Account = require('../models/account')

// Interfaces
import { IAccount } from '../interfaces/account'

class AccountController {
  public static async create(params: IAccount): Promise<string> {
    try {
      const _account = new Account(params)
      await _account.store()

      const { uuid } = _account
      return uuid
    } catch(error) {
      throw error
    }
  }

  public static async get(uuid: string): Promise<IAccount> {
    try {
      const _account = await Account.get(uuid)
      console.log('Account - Fetched account!')
      return _account
    } catch(error) {
      throw error
    }
  }
}

export = AccountController
