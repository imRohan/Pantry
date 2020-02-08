// Extarnal Libs

// External Files
import Account = require('../models/account')

// Interfaces
import { IAccount } from '../interfaces/account'

class AccountController {
  public static async create(params: IAccount): Promise<IAccount> {
    try {
      const _account = new Account(params)
      await _account.store()
      console.log('Account - Created new account!')
      return _account
    } catch(error) {
      console.log(`Accounts - Could not create account: ${error.message}`)
      throw new Error('Could not create account at this time')
    }
  }
}

export = AccountController
