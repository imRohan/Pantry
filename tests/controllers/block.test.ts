// External Files
import BlockController from '../../src/controllers/block'
import * as dataStore from '../../src/services/dataStore'

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
  it ('returns the payload of the block', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))
    const _payload = JSON.parse('{"derp": "flerp"}')

    const _response = await BlockController.create(_accountUUID, 'NewBlock', _payload)

    expect(_response).toEqual({ derp: 'flerp' })
  })

  it ('allows for empty payload', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

    const _response = await BlockController.create(_accountUUID, 'NewBlock', JSON.parse('{}'))

    expect(_response).toEqual({})
  })

  it ('throws an error if validation fails', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

    await expect(BlockController.create(_accountUUID, 'NewBlock', null))
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
    const _payload = JSON.parse('{"derp": "flerp"}')

    await expect(BlockController.create(_accountUUID, 'NewBlock', _payload))
      .rejects
      .toThrow('max number of baskets reached')
  })
})

describe('When updating a block', () => {
  const _newBlockData = JSON.parse('{"newKey": "newValue" }')

  it('successfully updates payload of block', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _response = await BlockController.update(_accountUUID, 'ExistingBlock', _newBlockData)

    expect(_response).toEqual({ derp: 'flerp', newKey: 'newValue' })
  })

  it ('throws an error if block does not exist', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'ExistingBlock'
    mockedDataStore.get
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
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _payload = await BlockController.get(_accountUUID, 'NewBlock')

    expect(_payload).toEqual({ derp: 'flerp' })
  })

  it ('throws an error if block does not exist', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'NewBlock'
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(null))

    await expect(BlockController.get(_accountUUID, _blockName))
      .rejects
      .toThrow(`${_blockName} does not exist`)
  })
})

describe('When deleting a block', () => {
  it ('returns void', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _payload = await BlockController.delete(_accountUUID, 'NewBlock')

    expect(_payload).not.toBeDefined()
  })

  it ('throws an error if block does not exist', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'NewBlock'
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(null))

    await expect(BlockController.delete(_accountUUID, _blockName))
      .rejects
      .toThrow(`${_blockName} does not exist`)
  })
})
