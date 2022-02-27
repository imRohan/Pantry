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
const landingRightTemplate = require('../templates/landingRight.html');
// Interfaces
const { IView } = require('../../interfaces/view.ts');
// Components
const basket = require('./basket.ts');
const dashboard = require('./dashboard.ts');
const sdk = require('./sdk.ts');
const home = require('./home.ts');
const onboarding = require('./onboarding.ts');
const about = require('./about.ts');
const systemStatus = require('./systemStatus.ts');
// Constants
const API_PATH = configs.apiPath;
const DOCS_PATH = configs.docsPath;
const landingRight = {
    props: ['view'],
    name: 'landingRight',
    components: {
        basket,
        dashboard,
        sdk,
        home,
        onboarding,
        about,
        systemStatus,
    },
    template: landingRightTemplate,
    data() {
        return {
            apiPath: API_PATH,
            pantryID: null,
            pantry: {
                id: null,
                data: null,
            },
            activeBasket: null,
            showErrors: false,
            showNameField: false,
        };
    },
    filters: {
        trim(text) {
            return String(text).trim();
        },
    },
    computed: {
        isStatusPositive() {
            if (!this.systemStatus) {
                return false;
            }
            const _statusArray = Object.values(this.systemStatus);
            const _operational = _statusArray.filter((status) => status);
            return _operational.length === _statusArray.length;
        },
        accountHasErrors() {
            return this.pantry.data.errors && this.pantry.data.errors.length > 0;
        },
    },
    methods: {
        changeView(view) {
            this.$emit('change-view', view);
        },
        displayOnboarding(pantryID) {
            this.pantryID = pantryID;
            this.$emit('change-view', IView.created);
        },
        createNewPantry() {
            return __awaiter(this, void 0, void 0, function* () {
                const _recaptchaResponse = window.grecaptcha.getResponse();
                const { accountName, email } = this.signup;
                this.accountCreationInProgress = true;
                const { data } = yield axios({
                    method: 'POST',
                    data: {
                        name: accountName,
                        description: 'defaultDescription',
                        contactEmail: email,
                        recaptchaResponse: _recaptchaResponse,
                    },
                    url: `${API_PATH}/pantry/create`,
                });
                this.pantry.id = data;
                this.$emit('change-view', IView.created);
            });
        },
        fetchPantry(pantryId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data } = yield axios({
                    method: 'GET',
                    url: `${API_PATH}/pantry/${pantryId}`,
                });
                this.pantry.id = pantryId;
                this.pantry.data = data;
            });
        },
        toggleBasket(name) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.activeBasket === name) {
                    this.activeBasket = null;
                }
                else {
                    this.activeBasket = name;
                }
            });
        },
        toggleErrors() {
            this.showErrors = !this.showErrors;
        },
        signupValid() {
            // eslint-disable-next-line max-len
            const _emailRegix = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return _emailRegix.test(String(this.signup.email).toLowerCase());
        },
        signupNameValid() {
            return this.signup.accountName !== null;
        },
        pantryIDValid() {
            return this.pantry.id !== null;
        },
        createAccountButtonDisabled() {
            return !this.signupNameValid() || this.accountCreationInProgress;
        },
        getStarted() {
            this.loadPantry();
            this.$emit('change-view', IView.dashboard);
        },
        goHome() {
            this.$emit('change-view', IView.home);
        },
        showDocs() {
            window.location.href = DOCS_PATH;
        },
        copyPantryId() {
            this.$emit('copy-text', this.pantry.id);
            this.copyPantryIdMessage = 'copied!';
        },
        copyText(text) {
            this.$emit('copy-text', text);
        },
        beginSignup() {
            this.showNameField = true;
        },
        showReCaptcha() {
            window.grecaptcha.render('recaptcha', {
                sitekey: this.siteKey,
            });
        },
        loadPantry() {
            if (this.pantryIDValid()) {
                this.fetchPantry(this.pantry.id);
            }
        },
        fetchURLParams() {
            if (this.view === IView.dashboard) {
                const _pantryId = decodeURIComponent(window.location.search.match(/(\?|&)pantryid\=([^&]*)/)[2]);
                this.fetchPantry(_pantryId);
            }
        },
        refreshDashboard() {
            return __awaiter(this, void 0, void 0, function* () {
                this.fetchPantry(this.pantry.id);
            });
        },
        createNewBasket() {
            return __awaiter(this, void 0, void 0, function* () {
                const _randomNumber = Math.floor((Math.random() * 100) + 1);
                const _defaultName = `newBasket${_randomNumber}`;
                const _name = prompt('What is the name of the new basket?', _defaultName);
                if (_name) {
                    yield axios({
                        method: 'POST',
                        data: {
                            key: 'value',
                        },
                        url: `${API_PATH}/pantry/${this.pantry.id}/basket/${_name}`,
                    });
                    this.fetchPantry(this.pantry.id);
                }
            });
        },
    },
    mounted() {
        this.fetchURLParams();
    },
};
module.exports = landingRight;
