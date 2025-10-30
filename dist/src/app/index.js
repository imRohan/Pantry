"use strict";
// External Files
const vue = require('vue');
// CSS
require('./scss/main.scss');
// Interfaces
const { IView } = require('../interfaces/view.ts');
// Components
const mainContent = require('./components/mainContent.ts');
const topbar = require('./components/topbar.ts');
const bottomBar = require('./components/bottomBar.ts');
const pantry = new vue({
    el: '.app',
    components: {
        mainContent,
        topbar,
        bottomBar,
    },
    data() {
        return {
            view: IView.home,
        };
    },
    methods: {
        changeView(view) {
            this.view = IView[view];
        },
        checkIfInView() {
            if (window.location.search) {
                const _view = decodeURIComponent(window.location.search.match(/(\?|&)show\=([^&]*)/)[2]);
                if (IView[_view]) {
                    this.view = IView[_view];
                }
            }
        },
    },
    created() {
        this.checkIfInView();
    },
});
module.exports = pantry;
