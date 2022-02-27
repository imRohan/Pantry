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
const basketTemplate = require('../templates/basket.html');
// Constants
const API_PATH = configs.apiPath;
const basket = {
    props: ['pantryId', 'basket'],
    name: 'basket',
    components: {
        'json-edit': jsonEditor,
    },
    template: basketTemplate,
    data() {
        return {
            apiPath: API_PATH,
        };
    },
    computed: {
        name() {
            return this.basket.name;
        },
        data: {
            get() {
                return this.basket.data;
            },
            set(newData) {
                this.basket.data = newData;
            },
        },
    },
    methods: {
        refreshDashboard() {
            this.$emit('update');
        },
        deleteBasket() {
            return __awaiter(this, void 0, void 0, function* () {
                const _response = confirm(`Are you sure you'd like to delete ${this.name}?`);
                if (_response) {
                    yield axios({
                        method: 'DELETE',
                        url: `${API_PATH}/pantry/${this.pantryId}/basket/${this.name}`,
                    });
                    this.refreshDashboard();
                }
            });
        },
        save() {
            return __awaiter(this, void 0, void 0, function* () {
                yield axios({
                    method: 'PUT',
                    data: this.data,
                    url: `${API_PATH}/pantry/${this.pantryId}/basket/${this.name}`,
                });
                alert(`${this.name} contents saved!`);
                this.refreshDashboard();
            });
        },
    },
};
module.exports = basket;
