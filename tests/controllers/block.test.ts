// External Files
import BlockController = require('../../src/controllers/block')
import dataStore = require('../../src/services/dataStore')

jest.mock('../../src/services/dataStore')
const mockedDataStore = dataStore as jest.Mocked<typeof dataStore>

// Interfaces
import { IAccountPrivate } from '../../src/interfaces/account'
import { IBlock } from '../../src/interfaces/block'

const _existingAccount: IAccountPrivate = {
  name: 'Existing Account',
  description: 'Account made while testing',
  contactEmail: 'derp@flerp.com',
  blocks: [],
  maxNumberOfBlocks: 50,
  notifications: true,
  uuid: '6dc70531-d0bf-4b3a-8265-b20f8a69e180',
}

const _block: IBlock = {
  accountUUID: _existingAccount.uuid,
  name: 'NewBlock',
  payload: { derp: 'flerp' }
}

afterEach(() => {    
  mockedDataStore.get.mockReset()
})

describe('When creating a block', () => {
  it ('returns successful create message', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    
    const _response = await BlockController.create(_accountUUID, _block)
    expect(_response).toMatch(/Your Pantry was updated with basket: NewBlock/)
  })
})

describe('When retrieving a block', () => {
  it ('successfully returns payload of block', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'NewBlock'

    mockedDataStore.get
      .mockReturnValue(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValue(Promise.resolve(JSON.stringify(_block)))

    const _payload = await BlockController.get(_accountUUID, _blockName)
    expect(_payload).toEqual(_block.payload)
  })
})
