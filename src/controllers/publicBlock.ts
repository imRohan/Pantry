// Extarnal Libs

// External Files
import Account from '../models/account'
import Block from '../models/block'
import PublicBlock from '../models/publicBlock'
import logService from '../services/logger'

// Logger setup
const logger = new logService('Public Block Controller')

class PublicBlockController {
  public static async create(accountUUID: string, name: string): Promise<string> {
    try {
      const _account = await Account.get(accountUUID)
      await PublicBlockController.checkIfBlockExists(_account, name)

      logger.info(`Creating new public link for block: ${name} in account:
                  ${accountUUID}`)

      const _publicBlock = new PublicBlock(accountUUID, name)
      const _publicName = await _publicBlock.store()

      return _publicName
    } catch (error) {
      logger.error(`Public link creation failed: ${error.message},
                    account: ${accountUUID}`)
      throw error
    }
  }

  private static async checkIfBlockExists(account: Account,
                                          name: string): Promise<void> {
    try {
      await Block.get(account.uuid, name)
    } catch (error) {
      await account.saveError(error.message)
      throw error
    }
  }
}

export default PublicBlockController
