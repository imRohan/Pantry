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
const jsonEditor = require('vue-json-editor').default;
// Configs
const configs = require('../config.ts');
// Templates
const explorerTemplate = require('../templates/explorer.html');
// Constants
const API_PATH = configs.apiPath;
// Components
const changelog = require('./changelog.ts');
const explorerEmpty = require('./explorerEmpty.ts');
const explorerOnboarding = require('./explorerOnboarding.ts');
const basket = require('./basket.ts');
const modal = require('./modal.ts');
const newBasketModal = require('./newBasketModal.ts');
const explorer = {
    name: 'explorer',
    props: ['pantry'],
    template: explorerTemplate,
    components: {
        changelog,
        explorerEmpty,
        explorerOnboarding,
        basket,
        modal,
        newBasketModal,
        'json-edit': jsonEditor,
    },
    data() {
        return {
            basket: null,
            schemaModalVisible: false,
            createBasketModalVisible: false,
            schemaExample: {
                _schema: {
                    toppings: { type: 'array' },
                    size: { type: 'string' },
                    price: { type: 'number' },
                },
                toppings: ['pepperoni', 'mushrooms', 'hot peppers'],
                size: 'large',
                price: 19.99,
            },
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
        daysToDeletion(ttl) {
            const _expiryDate = new Date();
            _expiryDate.setSeconds(ttl);
            return this.getDiffOfDates(new Date(), _expiryDate);
        },
        getDiffOfDates(start, end) {
            const _msPerDay = 1000 * 60 * 60 * 24;
            const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
            const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
            return Math.floor((endUTC - startUTC) / _msPerDay);
        },
        refresh() {
            this.$emit('refresh');
            this.basket = null;
        },
        createBasket(basketName, payload) {
            return __awaiter(this, void 0, void 0, function* () {
                if (basketName) {
                    yield axios({
                        method: 'POST',
                        data: payload,
                        url: `${API_PATH}/pantry/${this.pantry.id}/basket/${basketName}`,
                    });
                    this.refresh();
                    this.toggleCreateBasketModal();
                }
                else {
                    alert('Please enter a basket name');
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
        toggleSchemaModal() {
            this.schemaModalVisible = !this.schemaModalVisible;
        },
        toggleCreateBasketModal() {
            this.createBasketModalVisible = !this.createBasketModalVisible;
        },
    },
};
module.exports = explorer;
