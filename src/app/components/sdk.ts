// Templates
const sdkTemplate = require('../templates/sdk.html')

const sdk = {
  name: 'sdk',
  template: sdkTemplate,
  data(): any {
    return {
      sdks: [
        {
          name: 'pantry-node',
          platform: 'Node',
          hostPlatform: 'Github',
          link: 'https://github.com/imRohan/pantry-node',
        },
        {
          name: 'pantry-cloud',
          platform: 'Node',
          hostPlatform: 'Github',
          link: 'https://github.com/rdarida/pantry-cloud',
        },
        {
          name: 'bash-client',
          platform: 'Bash',
          hostPlatform: 'Github',
          link: 'https://github.com/imRohan/Pantry/tree/master/client-libraries/Bash',
        },
        {
          name: 'libPantryDotNet',
          platform: '.Net',
          hostPlatform: 'Github',
          link: 'https://github.com/Krutonium/libPantryDotNet',
        },
      ],
    }
  },
}

export = sdk
