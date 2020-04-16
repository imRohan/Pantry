// External Files
import AccountController = require('../../src/controllers/account')
import dataStore = require('../../src/services/dataStore')

jest.mock('../../src/services/dataStore')
const mockedDataStore = dataStore as jest.Mocked<typeof dataStore>

// Interfaces
import { IAccount, IAccountPrivate } from '../../src/interfaces/account'

describe('When creating an account', () => {
  it ('returns the account uuid', async () => {
    const _params: IAccount = {
      name: 'New Account',
      description: 'Account made while testing',
      contactEmail: 'derp@flerp.com',
    }

    const _uuid: string = await AccountController.create(_params)
    expect(_uuid).toBeDefined()
  })

  it ('throws an error if validations fail', async () => {
    const _params: any = {
      description: 'Account made while testing',
      contactEmail: 'derp@flerp.com',
    }

    await expect(AccountController.create(_params))
      .rejects
      .toThrow('Validation failed:')
  })
})

describe('When retrieving an account', () => {
  const _existingAccount: IAccountPrivate = {
    name: 'Existing Account',
    description: 'Account made while testing',
    contactEmail: 'derp@flerp.com',
    blocks: [],
    maxNumberOfBlocks: 50,
    notifications: true,
    uuid: '6dc70531-d0bf-4b3a-8265-b20f8a69e180',
  }

  it ('returns the correct account attributes', async () => {
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))

    const _accountBase: IAccount = await AccountController.get(_existingAccount.uuid)
    expect(_accountBase).toBeDefined()
  })

  it ('throws an error if account does not exist', async () => {
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(null))

    await expect(AccountController.get(_existingAccount.uuid))
      .rejects
      .toThrow(`pantry with id: ${_existingAccount.uuid} not found`)
  })
})

describe('When deleting an account', () => {
  const _existingAccount: IAccountPrivate = {
    name: 'Existing Account',
    description: 'Account made while testing',
    contactEmail: 'derp@flerp.com',
    blocks: [],
    maxNumberOfBlocks: 50,
    notifications: true,
    uuid: '6dc70531-d0bf-4b3a-8265-b20f8a69e180',
  }

  it ('returns confirmation message', async () => {
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))

    const _response = await AccountController.delete(_existingAccount.uuid)
    expect(_response).toMatch(/Your Pantry has been deleted/)
  })

  it ('throws an error if account does not exist', async () => {
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(null))

    await expect(AccountController.delete(_existingAccount.uuid))
      .rejects
      .toThrow(`pantry with id: ${_existingAccount.uuid} not found`)
  })
})
