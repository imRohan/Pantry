"use strict";
// Templates
const modalTemplate = require('../templates/modal.html');
const modal = {
    name: 'modal',
    template: modalTemplate,
    data() {
        return {};
    },
    methods: {
        close() {
            this.$emit('close');
        },
    },
};
module.exports = modal;
