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
const DOCS_PATH = configs.docsPath;
// Templates
const dashboardEmptyTemplate = require('../templates/dashboardEmpty.html');
const dashboardEmpty = {
    name: 'dashboardEmpty',
    template: dashboardEmptyTemplate,
    props: ['pantry'],
    data() {
        return {
            apiPath: API_PATH,
        };
    },
    methods: {
        showDocs() {
            window.location.href = DOCS_PATH;
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
                    this.refreshDashboard();
                }
            });
        },
        refreshDashboard() {
            this.$emit('update');
        },
    },
};
module.exports = dashboardEmpty;
