"use strict";
// Templates
const sdkTemplate = require('../templates/sdk.html');
const sdk = {
    name: 'sdk',
    template: sdkTemplate,
    data() {
        return {
            sdks: [
                {
                    name: 'pantry-node',
                    platform: 'Node.js',
                    author: 'Team Pantry',
                    link: 'https://github.com/imRohan/pantry-node',
                },
                {
                    name: 'pantry-cloud',
                    platform: 'Node.js',
                    author: 'rdarida',
                    link: 'https://github.com/rdarida/pantry-cloud',
                },
                {
                    name: 'bash-client',
                    platform: 'Bash',
                    author: 'Team Pantry',
                    link: 'https://github.com/imRohan/Pantry/tree/master/client-libraries/Bash',
                },
                {
                    name: 'libPantryDotNet',
                    platform: '.Net',
                    author: 'Krutonium',
                    link: 'https://github.com/Krutonium/libPantryDotNet',
                },
            ],
        };
    },
};
module.exports = sdk;
