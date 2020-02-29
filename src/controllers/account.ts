// Extarnal Libs

// External Files
import Account = require('../models/account')

// Interfaces
import { IAccountBase } from '../interfaces/account'

class AccountController {
  public static async create(params: IAccountBase): Promise<string> {
    try {
      const _account = new Account(params)
      const _accountUUID = await _account.store()

      console.log('Account - Created account!')
      return _accountUUID
    } catch (error) {
      console.log(`Account/create - ${error.message}`)
      throw error
    }
  }

  public static async get(uuid: string): Promise<IAccountBase> {
    try {
      const _account = await Account.get(uuid)
      const _accountDetails = _account.sanitize()

      console.log('Account - Fetched account!')
      return _accountDetails
    } catch (error) {
      console.log(`Account/get - ${error.message}`)
      throw error
    }
  }
}

export = AccountController
