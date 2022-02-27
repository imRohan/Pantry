"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// External Files
const axios = require('axios');
// Configs
const configs = require('../config.ts');
// Templates
const homeTemplate = require('../templates/home.html');
// Interfaces
const { IView } = require('../../interfaces/view.ts');
// Components
const initialSignup = require('./initialSignup.ts');
const finishSignup = require('./finishSignup.ts');
const features = require('./features.ts');
const example = require('./example.ts');
const stats = require('./stats.ts');
const quote = require('./quote.ts');
const banner = require('./banner.ts');
/* eslint-enable */
// Constants
const API_PATH = configs.apiPath;
const home = {
    name: 'home',
    template: homeTemplate,
    components: {
        initialSignup,
        finishSignup,
        features,
        example,
        stats,
        quote,
        banner,
    },
    data() {
        return {
            email: null,
            name: null,
            finishOnboarding: false,
            siteKey: '6Leqqt4aAAAAAFCxWwcRO3YB6zuKKR2CGm8ACRuJ',
            promo: {
                emoji: '💪',
                snippet: 'Integrate Pantry using our SDK!',
                title: 'Speed up your development by using one of our many SDKs!',
            },
        };
    },
    methods: {
        beginSignup(email) {
            this.email = email;
            this.finishOnboarding = true;
        },
        beginRegistration(name) {
            this.name = name;
            this.createNewPantry();
        },
        showReCaptcha() {
            window.grecaptcha.render('recaptcha', {
                sitekey: this.siteKey,
            });
        },
        createNewPantry() {
            return __awaiter(this, void 0, void 0, function* () {
                const _recaptchaResponse = window.grecaptcha.getResponse();
                this.accountCreationInProgress = true;
                const { data } = yield axios({
                    method: 'POST',
                    data: {
                        name: this.name,
                        description: 'defaultDescription',
                        contactEmail: this.email,
                        recaptchaResponse: _recaptchaResponse,
                    },
                    url: `${API_PATH}/pantry/create`,
                });
                this.$emit('account-created', data);
            });
        },
        bannerCTAClicked() {
            this.$emit('change-view', IView.sdk);
        },
    },
};
module.exports = home;
