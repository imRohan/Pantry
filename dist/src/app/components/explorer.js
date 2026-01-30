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
const modal = require('./modal.ts');
const explorer = {
    name: 'explorer',
    props: ['pantry'],
    template: explorerTemplate,
    components: {
        explorerEmpty,
        explorerOnboarding,
        basket,
        modal,
    },
    data() {
        return {
            basket: null,
            errorsModalVisible: false,
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
        openErrorsModal() {
            this.errorsModalVisible = true;
        },
        closeErrorsModal() {
            this.errorsModalVisible = false;
        },
        getDateOfDeletion(ttl) {
            const _currentDate = new Date();
            _currentDate.setSeconds(ttl);
            return _currentDate.toISOString().split('T')[0];
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
        renamePantry() {
            return __awaiter(this, void 0, void 0, function* () {
                const _defaultPantryName = this.pantry.name;
                const _namePantry = prompt('Pantry Name:', _defaultPantryName);
                if (_namePantry) {
                    yield axios({
                        method: 'PUT',
                        data: {
                            name: _namePantry,
                        },
                        url: `${API_PATH}/pantry/${this.pantry.id}`,
                    });
                    this.refresh();
                }
            });
        },
        changePantryDescription() {
            return __awaiter(this, void 0, void 0, function* () {
                const _defaultDesc = this.pantry.description;
                const _description = prompt('Pantry Description:', _defaultDesc);
                if (_description) {
                    yield axios({
                        method: 'PUT',
                        data: {
                            description: _description,
                        },
                        url: `${API_PATH}/pantry/${this.pantry.id}`,
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
