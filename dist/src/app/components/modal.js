"use strict";
// Templates
const modalTemplate = require('../templates/modal.html');
const modal = {
    name: 'modal',
    template: modalTemplate,
    props: ['readOnly'],
    data() {
        return {};
    },
    methods: {
        clicked() {
            this.$emit('clicked');
        },
        close() {
            this.$emit('close');
        },
    },
};
module.exports = modal;
