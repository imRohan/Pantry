// External Files
import SystemController = require('../../src/controllers/system')
import dataStore = require('../../src/services/dataStore')

jest.mock('../../src/services/dataStore')

const mockedDataStore = dataStore as jest.Mocked<typeof dataStore>

// Interfaces
import { ISystemStatus } from '../../src/interfaces/system'

afterEach(() => {
  mockedDataStore.get.mockReset()
  jest.clearAllMocks()
})

describe('When fetching system status', () => {
  it ('returns the system status', async () => {
    mockedDataStore.ping.mockReturnValueOnce(Promise.resolve(true))

    const _status: ISystemStatus = await SystemController.getStatus()

    expect(_status).toMatchObject({
      api: true,
      website: true,
      dataStore: true
    })
  })

  it ('detects offline dataStore', async () => {
    mockedDataStore.ping.mockReturnValueOnce(Promise.resolve(false))

    const _status: ISystemStatus = await SystemController.getStatus()
    const { dataStore } = _status

    expect(dataStore).toBe(false)
  })

  it ('returns a negative status if error is thrown', async () => {
    mockedDataStore.ping.mockReturnValueOnce(Promise.reject('error'))

    const _status: ISystemStatus = await SystemController.getStatus()

    expect(_status).toMatchObject({
      api: true,
      website: true,
      dataStore: false,
    })
  })
})
