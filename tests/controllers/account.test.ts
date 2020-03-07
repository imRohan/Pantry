// External Files
import AccountController = require('../../src/controllers/account')
jest.mock('../../src/services/dataStore')

// Interfaces
import { IAccountBase } from '../../src/interfaces/account'

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

    const _accountBase: IAccountBase = await AccountController.get('123')
    expect(_accountBase).toBeDefined()
  })
})
