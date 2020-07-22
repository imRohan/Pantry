// External Files
import BlockController = require('../../src/controllers/block')
import dataStore = require('../../src/services/dataStore')
import mailer = require('../../src/services/mailer')

jest.mock('../../src/services/dataStore')
jest.mock('../../src/services/mailer')

const mockedDataStore = dataStore as jest.Mocked<typeof dataStore>

// Interfaces
import { IAccountPrivate } from '../../src/interfaces/account'

// Constants
const _existingAccount: IAccountPrivate = {
  name: 'Existing Account',
  description: 'Account made while testing',
  contactEmail: 'derp@flerp.com',
  maxNumberOfBlocks: 50,
  notifications: true,
  errors: [],
  uuid: '6dc70531-d0bf-4b3a-8265-b20f8a69e180',
}

const _existingBlock = {
  accountUUID: _existingAccount.uuid,
  name: 'ExistingBlock',
  payload: { derp: 'flerp' },
}

afterEach(() => {
  mockedDataStore.get.mockReset()
  jest.clearAllMocks()
})

describe('When creating a block', () => {
  it ('returns successful create message', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'

    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

    const _response = await BlockController.create(_accountUUID, 'NewBlock', { derp: 'flerp' })
    expect(_response).toMatch(/Your Pantry was updated with basket: NewBlock/)
  })

  it ('allows for empty payload', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'

    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

    const _response = await BlockController.create(_accountUUID, 'NewBlock', {})
    expect(_response).toMatch(/Your Pantry was updated with basket: NewBlock/)
  })

  it ('throws an error if validation fails', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'

    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

    await expect(BlockController.create(_accountUUID, 'NewBlock', 'string'))
      .rejects
      .toThrow('Validation failed:')
  })

  it ('throws an error if account has reached max # of blocks', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _maxedAccount: IAccountPrivate = {
      name: 'Maxed Existing Account',
      description: 'Account made while testing',
      contactEmail: 'derp@flerp.com',
      maxNumberOfBlocks: 1,
      notifications: true,
      errors: [],
      uuid: '6dc70531-d0bf-4b3a-8265-b20f8a69e180',
    }

    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_maxedAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve(['oldBlock']))

    await expect(BlockController.create(_accountUUID, 'NewBlock', { derp: 'flerp' }))
      .rejects
      .toThrow('max number of baskets reached')
  })
})

describe('When updating a block', () => {
  const _newBlockData = { newKey: 'newValue' }

  it('successfully updates payload of block', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'

    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _response = await BlockController.update(_accountUUID, 'ExistingBlock', _newBlockData)
    expect(_response).toEqual({ derp: 'flerp', newKey: 'newValue' })
  })

  it ('throws an error if block does not exist', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'ExistingBlock'

    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(null))

    await expect(BlockController.update(_accountUUID, _blockName, _newBlockData))
      .rejects
      .toThrow(`${_blockName} does not exist`)
  })
})

describe('When retrieving a block', () => {
  it ('successfully returns payload of block', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'

    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _payload = await BlockController.get(_accountUUID, 'NewBlock')
    expect(_payload).toEqual({ derp: 'flerp' })
  })

  it ('throws an error if block does not exist', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'NewBlock'

    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(null))

    await expect(BlockController.get(_accountUUID, _blockName))
      .rejects
      .toThrow(`${_blockName} does not exist`)
  })
})

describe('When deleting a block', () => {
  it ('returns confirmation message', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'

    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _payload = await BlockController.delete(_accountUUID, 'NewBlock')
    expect(_payload).toMatch(/NewBlock was removed from your Pantry/)
  })

  it ('throws an error if block does not exist', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'NewBlock'

    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(null))

    await expect(BlockController.delete(_accountUUID, _blockName))
      .rejects
      .toThrow(`${_blockName} does not exist`)
  })
})

describe('When throwing a block error', () => {
  it ('does not email the user if error count is not divisable by 5', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'ExistingBlock'
    const _existingErrors = [ 'error #1' ]
    const _existingAccountWithErrors = { ..._existingAccount, errors: _existingErrors }

    const _spy = jest.spyOn(mailer, 'sendAccountErrorsEmail')
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccountWithErrors)))
      .mockReturnValueOnce(Promise.resolve(null))

    try {
      await BlockController.get(_accountUUID, _blockName)
    } catch {
      expect(_spy).not.toHaveBeenCalled()
    }

    _spy.mockRestore()
  })

  it('emails the user if error count reaches threshold', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'ExistingBlock'
    const _newError = `${_blockName} does not exist`
    const _existingErrors = [
      'error #1',
      'error #2',
      'error #3',
      'error #4',
    ]
    const _existingAccountWithErrors = { ..._existingAccount, errors: _existingErrors }

    const _spy = jest.spyOn(mailer, 'sendAccountErrorsEmail')
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccountWithErrors)))
      .mockReturnValueOnce(Promise.resolve(null))

    try {
      await BlockController.get(_accountUUID, _blockName)
    } catch {
      expect(_spy).toHaveBeenCalledTimes(1)
      expect(_spy)
        .toHaveBeenCalledWith(_newError, _existingAccount.contactEmail, _accountUUID)
    }

    _spy.mockRestore()
  })

  it('does not email the user if error count reaches threshold and notifications is false', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'ExistingBlock'
    const _existingErrors = [
      'error #1',
      'error #2',
      'error #3',
      'error #4',
    ]
    const _existingAccountWithErrorsAndNotificationsFalse = {
      ..._existingAccount,
      errors: _existingErrors,
      notifications: false,
    }

    const _spy = jest.spyOn(mailer, 'sendAccountErrorsEmail')
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccountWithErrorsAndNotificationsFalse)))
      .mockReturnValueOnce(Promise.resolve(null))

    try {
      await BlockController.get(_accountUUID, _blockName)
    } catch {
      expect(_spy).not.toHaveBeenCalled()
    }

    _spy.mockRestore()
  })
})
