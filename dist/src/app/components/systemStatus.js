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
const systemStatusTemplate = require('../templates/systemStatus.html');
const systemStatus = {
    name: 'systemStatus',
    template: systemStatusTemplate,
    props: [],
    data() {
        return {
            systemStatus: null,
        };
    },
    filters: {
        capitalizeKey(key) {
            if (!key) {
                return '';
            }
            const _key = key.toString();
            return (`${_key.charAt(0).toUpperCase()}${_key.slice(1).replace(/([A-Z][a-z])/g, ' $1')}`);
        },
        formatStatus(entity, status) {
            if (entity === 'activeAccounts') {
                return status === -1 ? 'unknown' : status.toString();
            }
            return status ? 'Operational' : 'Down';
        },
        trim(text) {
            return String(text).trim();
        },
        initials(text) {
            return text.split(' ').map((n) => n[0]).join('');
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
        fetchStatus() {
            return __awaiter(this, void 0, void 0, function* () {
                const { data } = yield axios({
                    method: 'GET',
                    url: `${API_PATH}/system/status`,
                });
                this.systemStatus = data;
            });
        },
        getStatusString() {
            const _positiveMessage = 'All Services Operational';
            const _negativeMessage = 'Pantry is Experiencing Issues';
            const _positiveStatus = this.isStatusPositive;
            return _positiveStatus ? _positiveMessage : _negativeMessage;
        },
    },
    mounted() {
        this.fetchStatus();
    },
};
module.exports = systemStatus;
