const dataStore = {
  get: jest.fn(async () => { }),
  set: jest.fn(async () => { }),
  remove: jest.fn(async () => { }),
  find: jest.fn(async () => { }),
  scan: jest.fn(async () => { }),
  ping: jest.fn(async () => { }),
}

export = dataStore
