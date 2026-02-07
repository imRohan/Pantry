// Templates
const template = require('../templates/changelog.html')

const changelog = {
  name: 'changelog',
  template,
  data(): any {
    return {
      items: [
        {
          description: 'Introduce Public Basket Endpoints',
        },
        {
          description: 'Performance Improvements',
        },
        {
          description: 'Added Nushell client',
        },
      ],
    }
  },
  methods: {},
}

export = changelog
