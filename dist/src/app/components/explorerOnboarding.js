"use strict";
// Templates
const explorerOnboardingTemplate = require('../templates/explorerOnboarding.html');
const explorerOnboarding = {
    name: 'explorerOnboarding',
    template: explorerOnboardingTemplate,
    data() {
        return {};
    },
    methods: {
        loadBasket() {
            this.$emit('load-basket');
        },
    },
};
module.exports = explorerOnboarding;
