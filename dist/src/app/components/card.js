"use strict";
// Templates
const cardTemplate = require('../templates/card.html');
const card = {
    name: 'card',
    template: cardTemplate,
    data() {
        return {};
    },
    methods: {
        clicked() {
            this.$emit('click');
        },
    },
};
module.exports = card;
