const dataStore = {
  get: jest.fn(async () => { return }),
  set: jest.fn(async () => { return }),
  delete: jest.fn(async () => { return }),
  scan: jest.fn(async () => { return }),
}

export = dataStore
