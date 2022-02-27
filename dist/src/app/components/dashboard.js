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
// Constants
const API_PATH = configs.apiPath;
// Templates
const dashboardTemplate = require('../templates/dashboard.html');
// Components
const explorer = require('./explorer.ts');
const login = require('./login.ts');
const banner = require('./banner.ts');
const dashboard = {
    name: 'dashboard',
    template: dashboardTemplate,
    props: ['pantryID'],
    components: {
        explorer,
        login,
        banner,
    },
    data() {
        return {
            signedIn: false,
            id: null,
            pantry: null,
            promo: {
                emoji: '🔥',
                snippet: 'Free Stickers?',
                title: 'Fill out our user survey and get free Pantry stickers!',
            },
        };
    },
    methods: {
        login(pantryID) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.fetchPantry(pantryID);
                    this.createSession();
                    this.signedIn = true;
                }
                catch (_a) {
                    alert('Login Failed. Is your PantryID correct?');
                }
            });
        },
        refresh() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.fetchPantry(this.id);
            });
        },
        fetchPantry(pantryId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data } = yield axios({
                    method: 'GET',
                    url: `${API_PATH}/pantry/${pantryId}`,
                });
                this.id = pantryId;
                this.pantry = Object.assign(Object.assign({}, data), { id: this.id });
            });
        },
        loadFromSession() {
            return __awaiter(this, void 0, void 0, function* () {
                if (sessionStorage.getItem('pantry-id') !== null) {
                    yield this.login(sessionStorage.getItem('pantry-id'));
                }
            });
        },
        createSession() {
            sessionStorage.setItem('pantry-id', this.id);
        },
        urlPantryID() {
            return window.location.search.match(/(\?|&)pantryid\=([^&]*)/);
        },
        loadFromURL() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.urlPantryID() === null) {
                    return;
                }
                const _pantryId = decodeURIComponent(this.urlPantryID()[2]);
                yield this.login(_pantryId);
            });
        },
        bannerCTAClicked() {
            window.location.href = 'https://tally.so/r/m6yPAn';
        },
    },
    mounted() {
        this.loadFromSession();
        this.loadFromURL();
    },
};
module.exports = dashboard;
