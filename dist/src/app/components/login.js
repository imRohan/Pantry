"use strict";
// Templates
const loginTemplate = require('../templates/login.html');
// Interfaces
const login = {
    name: 'login',
    template: loginTemplate,
    data() {
        return {
            id: null,
        };
    },
    methods: {
        idInvalid() {
            return this.id === null;
        },
        login() {
            this.$emit('login', this.id);
        },
    },
};
module.exports = login;
