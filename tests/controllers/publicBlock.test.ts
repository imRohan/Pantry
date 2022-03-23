// External Files
import PublicBlockController from '../../src/controllers/publicBlock'
import * as dataStore from '../../src/services/dataStore'

jest.mock('../../src/services/dataStore')

const mockedDataStore = dataStore as jest.Mocked<typeof dataStore>

// Interfaces
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
}

afterEach(() => {
  mockedDataStore.get.mockReset()
  jest.clearAllMocks()
})

describe('create', () => {
  it ('returns the name of the public block', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'ExistingBlock'

    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    const _name: string = await PublicBlockController.create(
      _accountUUID,
      _blockName
    )

    expect(_name).toBeDefined()
  })

  it ('throws an error if the account does not exist', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'NewBlock'

    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(null))

    await expect(PublicBlockController.create(_accountUUID, _blockName))
      .rejects
      .toThrow(`pantry with id: ${_accountUUID} not found`)
  })

  it ('throws an error if block does not exist', async () => {
    const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180'
    const _blockName = 'NewBlock'

    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(null))

    await expect(PublicBlockController.create(_accountUUID, _blockName))
      .rejects
      .toThrow(`${_blockName} does not exist`)
  })
})
