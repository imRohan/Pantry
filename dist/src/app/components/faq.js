"use strict";
// Templates
const faqTemplate = require('../templates/faq.html');
const faq = {
    name: 'faq',
    template: faqTemplate,
    props: ['questions'],
    data() {
        return {};
    },
};
module.exports = faq;
