"use strict";
// Templates
const headerTemplate = require('../templates/headerBar.html');
const headerBar = {
    name: 'headerBar',
    template: headerTemplate,
    props: ['view'],
    data() {
        return {};
    },
    methods: {},
};
module.exports = headerBar;
