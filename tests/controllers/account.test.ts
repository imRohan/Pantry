// External Files
import AccountController = require('../../src/controllers/account')
import dataStore = require('../../src/services/dataStore')
import mailer = require('../../src/services/mailer')
import crm = require('../../src/services/crm')

jest.mock('../../src/services/dataStore')
jest.mock('../../src/services/mailer')
jest.mock('../../src/services/crm')

const mockedDataStore = dataStore as jest.Mocked<typeof dataStore>

// Interfaces
import { IAccount, IAccountPrivate } from '../../src/interfaces/account'

afterEach(() => {
  mockedDataStore.get.mockReset()
  jest.clearAllMocks()
})

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

  it ('sends a welcome email', async () => {
    const _params: IAccount = {
      name: 'New Account',
      description: 'Account made while testing',
      contactEmail: 'derp@flerp.com',
    }

    const _spy = jest.spyOn(mailer, 'sendWelcomeEmail')
    const _uuid: string = await AccountController.create(_params)
    expect(_spy).toHaveBeenCalled()
    expect(_spy).toHaveBeenCalledWith(_params.contactEmail, _uuid)

    _spy.mockRestore()
  })

  it ('stores user details in crm platform', async () => {
    const _params: IAccount = {
      name: 'New Account',
      description: 'Account made while testing',
      contactEmail: 'derp@flerp.com',
    }

    const _spy = jest.spyOn(crm, 'addNewUser')
    const _uuid: string = await AccountController.create(_params)
    expect(_spy).toHaveBeenCalled()
    expect(_spy).toHaveBeenCalledWith(_params.contactEmail, _uuid)

    _spy.mockRestore()
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
    maxNumberOfBlocks: 50,
    notifications: true,
    uuid: '6dc70531-d0bf-4b3a-8265-b20f8a69e180',
  }

  it ('returns the correct account attributes', async () => {
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

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
    maxNumberOfBlocks: 50,
    notifications: true,
    uuid: '6dc70531-d0bf-4b3a-8265-b20f8a69e180',
  }

  it ('returns confirmation message', async () => {
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

    const _response = await AccountController.delete(_existingAccount.uuid)
    expect(_response).toMatch(/Your Pantry has been deleted/)
  })

  it ('deletes all existing blocks', async () => {
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify({ derp: 'flerp' })))

    mockedDataStore.find.mockReturnValueOnce(Promise.resolve(['existingBlock']))

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
