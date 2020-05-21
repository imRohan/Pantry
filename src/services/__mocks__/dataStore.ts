const dataStore = {
  get: jest.fn(async () => { return }),
  set: jest.fn(async () => { return }),
  delete: jest.fn(async () => { return }),
  find: jest.fn(async () => { return }),
  ping: jest.fn(async () => { return }),
}

export = dataStore
