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
const explorerTemplate = require('../templates/explorer.html');
// Constants
const API_PATH = configs.apiPath;
// Components
const explorerEmpty = require('./explorerEmpty.ts');
const explorerOnboarding = require('./explorerOnboarding.ts');
const basket = require('./basket.ts');
const explorer = {
    name: 'explorer',
    props: ['pantry'],
    template: explorerTemplate,
    components: {
        explorerEmpty,
        explorerOnboarding,
        basket,
    },
    data() {
        return {
            errorsVisible: false,
            basket: null,
        };
    },
    computed: {
        errorsExist() {
            return this.pantry.errors && this.pantry.errors.length > 0;
        },
        isPantryEmpty() {
            return this.pantry.baskets && this.pantry.baskets.length === 0;
        },
        activeBasket() {
            return this.basket ? this.basket.name : '';
        },
    },
    methods: {
        getDateOfDeletion(ttl) {
            const _currentDate = new Date();
            _currentDate.setSeconds(ttl);
            return _currentDate.toISOString().split('T')[0];
        },
        toggleErrors() {
            this.errorsVisible = !this.errorsVisible;
        },
        refresh() {
            this.$emit('refresh');
            this.basket = null;
        },
        createBasket() {
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
                    this.refresh();
                }
            });
        },
        viewBasket(name) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data } = yield axios({
                    method: 'GET',
                    url: `${API_PATH}/pantry/${this.pantry.id}/basket/${name}`,
                });
                this.basket = { data, name };
            });
        },
        loadBasket() {
            if (this.pantry.baskets && this.pantry.baskets.length > 0) {
                const { name } = this.pantry.baskets[0];
                this.viewBasket(name);
            }
        },
    },
};
module.exports = explorer;
