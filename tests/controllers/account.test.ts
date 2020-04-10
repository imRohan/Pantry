// External Files
import AccountController = require('../../src/controllers/account')
import dataStore = require('../../src/services/dataStore')

jest.mock('../../src/services/dataStore')
const mockedDataStore = dataStore as jest.Mocked<typeof dataStore>

// Interfaces
import { IAccountBase, IAccountPrivate } from '../../src/interfaces/account'

describe('When creating an account', () => {
  it ('returns the account uuid', async () => {
    const _params: IAccountBase = {
      name: 'New Account',
      description: 'Account made while testing',
      contactEmail: 'derp@flerp.com',
    }

    const _uuid: string = await AccountController.create(_params)
    expect(_uuid).toBeDefined()
  })
})

describe('When retrieving an account', () => {
  it ('returns the correct account attributes', async () => {
    const _existingAccount: IAccountPrivate = {
      name: 'Existing Account',
      description: 'Account made while testing',
      contactEmail: 'derp@flerp.com',
      blocks: [],
      maxNumberOfBlocks: 50,
      notifications: true,
      uuid: '123',
    }

    mockedDataStore.get.mockImplementation(() => Promise.resolve(JSON.stringify(_existingAccount)))
    const _accountBase: IAccountBase = await AccountController.get('123')
    expect(_accountBase).toBeDefined()
  })
})