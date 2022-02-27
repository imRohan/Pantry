"use strict";
// Templates
const aboutTemplate = require('../templates/about.html');
// Components
const faq = require('./faq.ts');
const about = {
    name: 'about',
    template: aboutTemplate,
    props: [],
    components: {
        faq,
    },
    data() {
        return {
            questions: [
                {
                    title: 'What is Pantry?',
                    answer: `Pantry is a free data storage service which allows users to manage
            a collection of JSON objects. It is great for small to medium sized projects,
            and can be interacted with through a RESTful API or via a dashboard.`,
                },
                {
                    title: 'What is a Basket?',
                    answer: `A "Basket" is one JSON object. Each Pantry can have up to 100 baskets
            held within it, each with its own human-readable name.`,
                },
                {
                    title: 'How is my data stored?',
                    answer: `Every basket is encrypted using the AES-256 encryption scheme and is securely
            stored on our servers after being properly sanitized.`,
                },
                {
                    title: 'What are the limitations?',
                    answer: `A Pantry can have up to 100 baskets (JSON objects), each with a max size
            of 1.44mb per basket. API requests are limited to 2 calls per second. That's it.`,
                },
                {
                    title: 'How long will my data be stored for?',
                    answer: `Data is stored until you no longer need it. Users can choose to delete
            their data from Pantry at any time. However, inactive baskets will be removed after 30 days.`,
                },
            ],
        };
    },
    methods: {},
};
module.exports = about;
