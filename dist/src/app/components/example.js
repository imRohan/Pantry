"use strict";
// Templates
const exampleTemplate = require('../templates/example.html');
// Interfaces
const { IView } = require('../../interfaces/view.ts');
const example = {
    name: 'example',
    template: exampleTemplate,
    methods: {
        showSDK() {
            this.$emit('change-view', IView.sdk);
        },
    },
};
module.exports = example;
