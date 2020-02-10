// Extarnal Libs

// External Files
import Account = require('../models/account')
import Block = require('../models/block')

// Interfaces
import { IBlock } from '../interfaces/block'

class BlockController {
  public static async create(accountUUID: string, params: IBlock): Promise<string> {
    try {
      // Check if account exists
      const _accountExists = await Account.checkIfExists(accountUUID)
      if (!_accountExists) {
        throw new Error(`Could not create block, account does not exist`)
      }

      // Create/update block for given account
      const { name } = params
      const _block = new Block(accountUUID, params)
      await _block.store()
      console.log(`Block - Created new block: ${name} for account: ${accountUUID}`)

      // Store block name in account entity
      await Account.addBlock(accountUUID, name)

      return `Created new block: ${name}!`
    } catch (error) {
      console.log(`Block/create - ${error.message}`)
      throw error
    }
  }

  public static async get(accountUUID: string, name: string): Promise<any> {
    try {
      // Check if account exists
      const _accountExists = await Account.checkIfExists(accountUUID)
      if (!_accountExists) {
        throw new Error(`Could not create block, account does not exist`)
      }

      const _block = await Block.get(accountUUID, name)

      console.log('Block - Fetched block!')
      return _block
    } catch (error) {
      console.log(`Block/get - ${error.message}`)
      throw error
    }
  }
}

export = BlockController
