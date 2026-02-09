import logService from '../services/logger'
import * as dataStore from '../services/dataStore'
import Account from '../models/account'
import PublicBlock from '../models/publicBlock'

import { ISystemStatus } from '../interfaces/system'

const logger = new logService('System Controller')

class SystemController {
  public static async getStatus(): Promise<ISystemStatus> {
    try {
      const _dataStoreStatus = await dataStore.ping()
      const _totalAccounts = await Account.getTotalNumber()
      const _totalPublicBlocks = await PublicBlock.getTotalNumber()
      const _status = {
        website: true,
        api: true,
        dataStore: _dataStoreStatus,
        activeAccounts: _totalAccounts,
        publicBlocks: _totalPublicBlocks,
      }

      logger.info('System status retrieved')
      return _status
    } catch (error) {
      logger.error(`System status retrieval failed: ${error.message}`)

      const _errorStatus = {
        website: true,
        api: true,
        dataStore: false,
        activeAccounts: -1,
        publicBlocks: -1,
      }
      return _errorStatus
    }
  }
}

export default SystemController
