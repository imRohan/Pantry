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
        {
          name: 'pantry-nim',
          platform: 'Nim',
          author: 'Jake Leahy',
          link: 'https://github.com/ire4ever1190/pantry-nim',
          verified: false,
        },
        {
          name: 'JPantry',
          platform: 'Java',
          author: 'Magnus Gunnarsson',
          link: 'https://github.com/EnderCrypt/JPantry',
          verified: false,
        },
        {
          name: 'pantry-cloud',
          platform: 'Python',
          author: 'Sarvesh Kumar Dwivedi',
          link: 'https://github.com/sarvesh4396/pantry-cloud',
          verified: false,
        },
        {
          name: 'pantry-cloud',
          platform: 'PHP',
          author: 'Seba',
          link: 'https://github.com/sebaOfficial/pantry-cloud/',
          verified: false,
        },
        {
          name: 'pantry_client',
          platform: 'GO',
          author: 'Atoo35',
          link: 'https://github.com/Atoo35/pantry_client/',
          verified: false,
        },
        {
          name: 'pantry',
          platform: 'Dart',
          author: 'Georges',
          link: 'https://github.com/georges-ph/pantry',
          verified: false,
        },
        {
          name: 'pantry_client',
          platform: 'Rust',
          author: 'Atoo35',
          link: 'https://github.com/Atoo35/pantry_client_rust/',
          verified: false,
        },
        {
          name: 'UniPantry',
          platform: 'Unity',
          author: 'Dmitry Koleev',
          link: 'https://github.com/dkoleev/UniPantry/',
          verified: false,
        },
        {
          name: 'PantryJS',
          platform: 'Node.js',
          author: 'DinoscapeProgramming',
          link: 'https://github.com/DinoscapeProgramming/PantryJS/',
          verified: false
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
        'nim': 'bg-yellow-400',
        'java': 'bg-red-400',
        'dart': 'bg-blue-500',
      }

      return _table[_platform] ?? 'bg-gray-200'
    },
  },
}

export = sdk
