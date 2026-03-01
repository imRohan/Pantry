// External Files
import BlockController from '../../src/controllers/block'
import Account from '../../src/models/account'
import Block from '../../src/models/block'
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
  createdAt: new Date(),
  updatedAt: null,
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

    expect(_response).toMatchObject({ derp: 'flerp' })
  })

  it ('allows for empty payload', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

    const _response = await BlockController.create(_accountUUID, 'NewBlock', JSON.parse('{}'))

    expect(_response).toMatchObject({})
  })

  it ('refreshes the TTL of the account', async () => {
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))
    const _payload = JSON.parse('{"derp": "flerp"}')
    const _redisKey = `account:${_existingAccount.uuid}`

    await BlockController.create(_existingAccount.uuid, 'NewBlock', _payload)

    expect(mockedDataStore.refreshTTL).toHaveBeenCalledWith(_redisKey, Account.lifeSpan)
  })

  it ('includes metadata', async() => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

    const _response = await BlockController
      .create(_existingAccount.uuid, 'NewBlock', JSON.parse('{}'))

    expect(_response).toHaveProperty('_metadata')
  })

  it ('includes createdAt in the metadata', async() => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

    const { _metadata } = await BlockController
      .create(_existingAccount.uuid, 'NewBlock', JSON.parse('{}'))

    expect(_metadata).toHaveProperty('createdAt')
  })


  it ('does not set a value for updatedAt', async() => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

    const { _metadata } = await BlockController
      .create(_existingAccount.uuid, 'NewBlock', JSON.parse('{}'))

    expect(_metadata.updatedAt).toBeNull()
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
      .toThrow('maximum storage limit has been reached')
  })
})

describe('When updating a block', () => {
  const _newBlockData = JSON.parse('{"newKey": "newValue" }')

  it('successfully updates payload of block', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _response = await BlockController
      .update(_existingAccount.uuid, _existingBlock.name, _newBlockData)

    expect(_response).toMatchObject({ derp: 'flerp', newKey: 'newValue' })
  })

  it ('refreshes the TTL of the block', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))
    const _redisKey = `account:${_existingAccount.uuid}::block:${_existingBlock.name}`

    await BlockController
      .update(_existingAccount.uuid, _existingBlock.name, _newBlockData)

    expect(mockedDataStore.refreshTTL).toHaveBeenCalledWith(_redisKey, Block.lifeSpan)
  })

  it ('refreshes the TTL of the account', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))
    const _redisKey = `account:${_existingAccount.uuid}`

    await BlockController
      .update(_existingAccount.uuid, _existingBlock.name, _newBlockData)

    expect(mockedDataStore.refreshTTL).toHaveBeenCalledWith(_redisKey, Account.lifeSpan)
  })

  it ('includes metadata', async() => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _response = await BlockController
      .update(_existingAccount.uuid, _existingBlock.name, _newBlockData)

    expect(_response).toHaveProperty('_metadata')
  })

  it ('includes createdAt in the metadata', async() => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const { _metadata } = await BlockController
      .update(_existingAccount.uuid, _existingBlock.name, _newBlockData)

    expect(_metadata).toHaveProperty('createdAt')
  })

  it ('does not update the createdAt value metadata', async() => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const { _metadata } = await BlockController
      .update(_existingAccount.uuid, _existingBlock.name, _newBlockData)

    expect(_metadata.createdAt).toEqual(_existingBlock.createdAt.toUTCString())
  })


  it ('includes updatedAt in the metadata', async() => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const { _metadata } = await BlockController
      .update(_existingAccount.uuid, _existingBlock.name, _newBlockData)

    expect(_metadata.updatedAt).toBeDefined()
  })

  it ('updates the updatedAt value metadata', async() => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const { _metadata } = await BlockController
      .update(_existingAccount.uuid, _existingBlock.name, _newBlockData)

    expect(_metadata.updatedAt).not.toEqual(_existingBlock.updatedAt)
  })

  it ('throws an error if the account does not exist', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(null))

    await expect(BlockController
      .update('1234', _existingBlock.name, _newBlockData))
      .rejects
      .toThrow('pantry with id: 1234 not found')
  })

  it ('throws an error if block does not exist', async () => {
    const _blockName = 'ExistingBlock'
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(null))

    await expect(BlockController
      .update(_existingAccount.uuid, _blockName, _newBlockData))
      .rejects
      .toThrow(`${_blockName} does not exist`)
  })
})

describe('When retrieving a block', () => {
  it ('successfully returns payload of block', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _payload = await BlockController.get(_existingAccount.uuid, 'NewBlock')

    expect(_payload).toMatchObject({ derp: 'flerp' })
  })

  it ('the response includes the metadata of the block', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _payload = await BlockController.get(_existingAccount.uuid, 'NewBlock')

    expect(_payload).toHaveProperty('_metadata')
  })

  it ('refreshes the TTL of the block', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))
    const _redisKey = `account:${_existingAccount.uuid}::block:${_existingBlock.name}`

    await BlockController.get(_existingAccount.uuid, _existingBlock.name)

    expect(mockedDataStore.refreshTTL).toHaveBeenCalledWith(_redisKey, Block.lifeSpan)
  })

  it ('refreshes the TTL of the account', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))
    const _redisKey = `account:${_existingAccount.uuid}`

    await BlockController.get(_existingAccount.uuid, _existingBlock.name)

    expect(mockedDataStore.refreshTTL).toHaveBeenCalledWith(_redisKey, Account.lifeSpan)
  })

  it ('throws an error if the account does not exist', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(null))

    await expect(BlockController.get('1234', 'test'))
      .rejects
      .toThrow('pantry with id: 1234 not found')
  })

  it ('throws an error if the block does not exist', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(null))

    await expect(BlockController.get(_existingAccount.uuid, 'testBlock'))
      .rejects
      .toThrow('testBlock does not exist')
  })
})

describe('When deleting a block', () => {
  it ('returns void', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _payload = await BlockController
      .delete(_existingAccount.uuid, _existingBlock.name)

    expect(_payload).not.toBeDefined()
  })

  it ('refreshes the TTL of the account', async () => {
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))
    const _redisKey = `account:${_existingAccount.uuid}`

    await BlockController.delete(_existingAccount.uuid, _existingBlock.name)

    expect(mockedDataStore.refreshTTL)
      .toHaveBeenCalledWith(_redisKey, Account.lifeSpan)
  })

  it ('throws an error if the account does not exist', async () => {
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(null))

    await expect(BlockController
      .delete('1234', _existingBlock.name))
      .rejects
      .toThrow('pantry with id: 1234 not found')
  })

  it ('throws an error if block does not exist', async () => {
    const _blockName = 'NewBlock'
    mockedDataStore.get.
      mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(null))

    await expect(BlockController.delete(_existingAccount.uuid, _blockName))
      .rejects
      .toThrow(`${_blockName} does not exist`)
  })
})
