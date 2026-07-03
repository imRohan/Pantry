"use strict";
// Configs
const configs = require('../config.ts');
// Constants
const API_PATH = configs.apiPath;
// Templates
const explorerEmptyTemplate = require('../templates/explorerEmpty.html');
const explorerEmpty = {
    name: 'explorerEmpty',
    template: explorerEmptyTemplate,
    props: ['pantryId'],
    data() {
        return {
            apiPath: API_PATH,
        };
    },
};
module.exports = explorerEmpty;
