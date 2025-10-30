"use strict";
// Configs
const configs = require('../config.ts');
// Constants
const API_PATH = configs.apiPath;
const DOCS_PATH = configs.docsPath;
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
    methods: {
        showDocs() {
            window.location.href = DOCS_PATH;
        },
    },
};
module.exports = explorerEmpty;
