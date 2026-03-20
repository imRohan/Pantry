// External Files
import PublicBlockController from '../../src/controllers/publicBlock'
import Block from '../../src/models/block'
import PublicBlock from '../../src/models/publicBlock'
import * as dataStore from '../../src/services/dataStore'

jest.mock('../../src/services/dataStore')

const mockedDataStore = dataStore as jest.Mocked<typeof dataStore>

// Interfaces
import { IPublicBlock } from '../../src/interfaces/publicBlock'
import { IAccountPrivate } from '../../src/interfaces/account'
import { IBlock } from '../../src/interfaces/block'

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

const _existingBlock: IBlock = {
  accountUUID: _existingAccount.uuid,
  name: 'ExistingBlock',
  payload: { derp: 'flerp' },
  createdAt: new Date(),
  updatedAt: null,
}

const _existingPublicBlock: IPublicBlock = {
  accountUUID: _existingAccount.uuid,
  blockName: _existingBlock.name,
  id: '5dc70531-d0bf-4b3a-8265-b20f8a69e180',
}

afterEach(() => {
  mockedDataStore.get.mockReset()
  jest.clearAllMocks()
})

describe('When creating a public block', () => {
  it ('returns the public blocks id', async () => {
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _response = await PublicBlockController.create(_existingAccount.uuid, _existingBlock.name)

    expect(_response).toBeDefined()
  })

  it ('refreshes the TTL of the block', async () => {
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))
    const _redisKey = `account:${_existingAccount.uuid}::block:${_existingBlock.name}`

    await PublicBlockController.create(_existingAccount.uuid, _existingBlock.name)

    expect(mockedDataStore.refreshTTL).toHaveBeenCalledWith(_redisKey, Block.lifeSpan)
  })

  describe('When the block does not exist', () => {
    it ('throws an error', async () => {
      mockedDataStore.get
        .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
        .mockReturnValueOnce(Promise.resolve(null))

      await expect(PublicBlockController.create(_existingAccount.uuid, _existingBlock.name))
        .rejects
        .toThrow(`basket not found, please contact the Pantry owner`)
    })
  })
})

describe('When retrieving a public block', () => {
  it ('successfully returns payload of the associated block', async () => {
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingPublicBlock)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _payload = await PublicBlockController.get(_existingPublicBlock.id)

    expect(_payload).toMatchObject({ derp: 'flerp' })
  })

  it ('the response does not include the metadata of the associated block', async () => {
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingPublicBlock)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _payload = await PublicBlockController.get(_existingPublicBlock.id)

    expect(_payload).not.toHaveProperty('_metadata')
  })

  it ('refreshes the TTL of the public block', async () => {
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingPublicBlock)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))
    const _redisKey = `public_block:${_existingPublicBlock.id}`

    await PublicBlockController.get(_existingPublicBlock.id)

    expect(mockedDataStore.refreshTTL)
      .toHaveBeenCalledWith(_redisKey, PublicBlock.lifeSpan)
  })

  it ('refreshes the TTL of the block', async () => {
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingPublicBlock)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))
    const _redisKey = `account:${_existingAccount.uuid}::block:${_existingBlock.name}`

    await PublicBlockController.get(_existingPublicBlock.id)

    expect(mockedDataStore.refreshTTL)
      .toHaveBeenCalledWith(_redisKey, Block.lifeSpan)
  })

  it ('throws an error if public block does not exist', async () => {
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(null))

    await expect(PublicBlockController.get(_existingPublicBlock.id))
      .rejects
      .toThrow(`${_existingPublicBlock.id} does not exist`)
  })

  describe('and the block has a schema', () => {
    it ('the response does not include the schema of the associated block', async () => {
      const _block = {
        accountUUID: _existingAccount.uuid,
        name: 'ExistingBlock',
        payload: {
          userName: 'flerp',
          _schema: {
            name: { type: 'string' },
          },
        },
      }
      mockedDataStore.get
        .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingPublicBlock)))
        .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
        .mockReturnValueOnce(Promise.resolve(JSON.stringify(_block)))

      const _payload = await PublicBlockController.get(_existingPublicBlock.id)

      expect(_payload).not.toHaveProperty('_schema')
    })
  })
})
