const mock = jest.fn().mockImplementation(() => {
  const _account = {
    name: 'New Account',
    description: 'Account made while testing',
    contactEmail: 'derp@flerp.com',
    blocks: ['derp', 'flerp'],
    maxNumberOfBlocks: 50,
    notifications: true,
    uuid: '12345',
  }
  return {
    get: () => (JSON.stringify(_account)),
    set: () => { return },
  }
})

export = mock
