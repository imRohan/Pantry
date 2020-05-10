// External Files
import AccountController = require('../../src/controllers/account')
import crm = require('../../src/services/crm')
import dataStore = require('../../src/services/dataStore')
import mailer = require('../../src/services/mailer')

jest.mock('../../src/services/dataStore')
jest.mock('../../src/services/mailer')
jest.mock('../../src/services/crm')

const mockedDataStore = dataStore as jest.Mocked<typeof dataStore>

// Interfaces
import { IAccount, IAccountPrivate } from '../../src/interfaces/account'

// Constants
const _newAccountParams: IAccount = {
  name: 'New Account',
  description: 'Account made while testing',
  contactEmail: 'derp@flerp.com',
}

const _existingAccount: IAccountPrivate = {
  name: 'Existing Account',
  description: 'Account made while testing',
  contactEmail: 'derp@flerp.com',
  maxNumberOfBlocks: 50,
  notifications: true,
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

describe('When creating an account', () => {
  it ('returns the account uuid', async () => {
    const _uuid: string = await AccountController.create(_newAccountParams)
    expect(_uuid).toBeDefined()
  })

  it ('sends a welcome email', async () => {
    const _spy = jest.spyOn(mailer, 'sendWelcomeEmail')

    const _uuid: string = await AccountController.create(_newAccountParams)

    expect(_spy).toHaveBeenCalled()
    expect(_spy).toHaveBeenCalledWith(_newAccountParams.contactEmail, _uuid)

    _spy.mockRestore()
  })

  it ('stores user details in crm platform', async () => {
    const _spy = jest.spyOn(crm, 'addNewUser')

    const _uuid: string = await AccountController.create(_newAccountParams)

    expect(_spy).toHaveBeenCalled()
    expect(_spy).toHaveBeenCalledWith(_newAccountParams.contactEmail, _uuid)

    _spy.mockRestore()
  })

  it ('throws an error if validations fail', async () => {
    const _invalidAccountParams: any = {
      description: 'Account made while testing',
      contactEmail: 'derp@flerp.com',
    }

    await expect(AccountController.create(_invalidAccountParams))
      .rejects
      .toThrow('Validation failed:')
  })
})

describe('When retrieving an account', () => {
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
  it ('returns confirmation message', async () => {
    mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]))

    const _response = await AccountController.delete(_existingAccount.uuid)

    expect(_response).toMatch(/Your Pantry has been deleted/)
  })

  it('deletes all existing blocks', async () => {
    mockedDataStore.get
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
      .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)))

    mockedDataStore.find.mockReturnValueOnce(Promise.resolve([`account:${_existingAccount.uuid}::block:${_existingBlock.name}`]))

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
