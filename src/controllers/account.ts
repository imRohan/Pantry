// Extarnal Libs

// External Files
import Account from '../models/account'
import Block from '../models/block'
import Crm from '../services/crm'
import Mailer from '../services/mailer'
import logService from '../services/logger'
import * as recaptcha from '../services/recaptcha'

// Interfaces
import { IAccountParams, IAccountPublic, IAccountUpdateParams } from '../interfaces/account'

// Logger setup
const logger = new logService('Account Controller')

class AccountController {
  public static async create(params: IAccountParams): Promise<string> {
    try {
      const { recaptchaResponse } = params
      const _verified = await recaptcha.verify(recaptchaResponse)

      if (!_verified) {
        throw new Error('ReCaptcha Failed')
      }

      const _account = new Account(params)
      await _account.store()

      const { contactEmail } = params
      void Crm.addNewUser(contactEmail, _account.uuid)
      void Mailer.sendWelcomeEmail(contactEmail, _account.uuid, _account.name)

      logger.logAndSlack(`Account created for ${contactEmail}: ${_account.uuid}`)
      return _account.uuid
    } catch (error) {
      logger.error(`Account creation failed: ${error.message}`)
      throw error
    }
  }

  public static async update(uuid: string, data: Partial<IAccountUpdateParams>): Promise<IAccountPublic> {
    try {
      const _account = await Account.get(uuid)
      await _account.update(data)

      logger.info(`Account ${uuid} was updated`)
      const _accountDetails = _account.sanitize()
      return _accountDetails
    } catch (error) {
      logger.error(`Account update failed: ${error.message}`)
      throw error
    }
  }

  public static async get(uuid: string): Promise<IAccountPublic> {
    try {
      const _account = await Account.get(uuid)
      const _accountDetails = _account.sanitize()

      logger.info(`Account ${uuid} retrieved`)
      return _accountDetails
    } catch (error) {
      logger.error(`Account retrieval failed: ${error.message}`)
      throw error
    }
  }

  public static async delete(uuid: string): Promise<string> {
    try {
      const _account = await Account.get(uuid)
      const _blocks = await _account.getBlocks()

      logger.info(`Starting deletion of account: ${uuid}`)
      for (const _item of _blocks) {
        const { name } = _item
        logger.info(`Deleting block ${name} in account: ${uuid}`)
        const _block = await Block.get(uuid, name)
        await _block.delete()
      }
      await _account.delete()

      logger.info(`Account ${uuid} deleted`)
      return 'Your Pantry has been deleted!'
    } catch (error) {
      logger.error(`Account deletion failed: ${error.message}`)
      throw error
    }
  }
}

export default AccountController
