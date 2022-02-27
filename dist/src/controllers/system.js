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
Object.defineProperty(exports, "__esModule", { value: true });
// External Files
const dataStore = require("../services/dataStore");
const logger_1 = require("../services/logger");
const account_1 = require("../models/account");
// Logger setup
const logger = new logger_1.default('System Controller');
class SystemController {
    static getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _dataStoreStatus = yield dataStore.ping();
                const _totalAccounts = yield account_1.default.getTotalNumber();
                const _status = {
                    website: true,
                    api: true,
                    dataStore: _dataStoreStatus,
                    activeAccounts: _totalAccounts,
                };
                logger.info('System status retrieved');
                return _status;
            }
            catch (error) {
                logger.error(`System status retrieval failed: ${error.message}`);
                const _errorStatus = {
                    website: true,
                    api: true,
                    dataStore: false,
                    activeAccounts: -1,
                };
                return _errorStatus;
            }
        });
    }
}
exports.default = SystemController;
