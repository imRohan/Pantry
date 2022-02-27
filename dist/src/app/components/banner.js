"use strict";
// Templates
const bannerTemplate = require('../templates/banner.html');
const banner = {
    name: 'banner',
    template: bannerTemplate,
    props: ['promo'],
    data() {
        return {
            visible: true,
        };
    },
    methods: {
        clickedCTA() {
            this.$emit('cta-clicked');
        },
        hide() {
            this.visible = false;
        },
    },
};
module.exports = banner;
