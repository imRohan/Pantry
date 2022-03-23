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
          platform: 'Node.js',
          author: 'Team Pantry',
          link: 'https://github.com/imRohan/pantry-node',
          verified: true,
        },
        {
          name: 'bash-client',
          platform: 'Bash',
          author: 'Team Pantry',
          link: 'https://github.com/imRohan/Pantry/tree/master/client-libraries/Bash',
          verified: true,
        },
        {
          name: 'libPantryDotNet',
          platform: '.Net',
          author: 'Krutonium',
          link: 'https://github.com/Krutonium/libPantryDotNet',
          verified: false,
        },
        {
          name: 'pantry-cloud',
          platform: 'Node.js',
          author: 'rdarida',
          link: 'https://github.com/rdarida/pantry-cloud',
          verified: false,
        },
        {
          name: 'pantry_wrapper',
          platform: 'Python',
          author: 'alexmulligan',
          link: 'https://github.com/alexmulligan/pantry_wrapper',
          verified: false,
        },
      ],
      defaultBadgeClasses: `flex-shrink-0 inline-block px-2 py-0.5
                            text-xs font-medium
                            rounded-full`,
    }
  },
  methods: {
    getBadgeClass(platform: string): string {
      const _platform = platform.trim().toLowerCase()
      const _table: { [key: string]: string } = {
        'node.js': 'bg-green-200',
        'bash': 'bg-gray-200',
        'python': 'bg-yellow-200',
        '.net': 'bg-blue-200',
      }

      return _table[_platform] ?? 'bg-gray-200'
    },
  },
}

export = sdk
