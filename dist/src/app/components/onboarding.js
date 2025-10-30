"use strict";
// Templates
const onboardingTemplate = require('../templates/onboarding.html');
// Interfaces
const { IView } = require('../../interfaces/view.ts');
const onboarding = {
    name: 'onboarding',
    template: onboardingTemplate,
    props: ['pantryID'],
    data() {
        return {};
    },
    methods: {
        getStarted() {
            this.$emit('change-view', IView.dashboard);
        },
        createSession() {
            sessionStorage.setItem('pantry-id', this.pantryID);
        },
    },
    mounted() {
        this.createSession();
    },
};
module.exports = onboarding;
