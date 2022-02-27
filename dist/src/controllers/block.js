"use strict";
// Extarnal Libs
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
const account_1 = require("../models/account");
const block_1 = require("../models/block");
const logger_1 = require("../services/logger");
// Logger setup
const logger = new logger_1.default('Block Controller');
class BlockController {
    static create(accountUUID, name, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _account = yield account_1.default.get(accountUUID);
                // Check if account has reached max number of blocks
                const _accountFull = yield _account.checkIfFull();
                if (_accountFull) {
                    const _errorMessage = 'max number of baskets reached';
                    yield _account.saveError(_errorMessage);
                    throw new Error(_errorMessage);
                }
                logger.info(`Creating new block in account: ${accountUUID}`);
                const _block = new block_1.default(accountUUID, name, payload);
                yield _block.store();
                return `Your Pantry was updated with basket: ${name}!`;
            }
            catch (error) {
                logger.error(`Block creation failed: ${error.message}, account: ${accountUUID}`);
                throw error;
            }
        });
    }
    static get(accountUUID, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let _block;
                let _blockDetails;
                const _account = yield account_1.default.get(accountUUID);
                try {
                    _block = yield block_1.default.get(accountUUID, name);
                    _blockDetails = _block.sanitize();
                }
                catch (error) {
                    yield _account.saveError(error.message);
                    throw error;
                }
                logger.info('Block retrieved');
                return _blockDetails;
            }
            catch (error) {
                logger.error(`Block retrieval failed: ${error.message}, account: ${accountUUID}`);
                throw error;
            }
        });
    }
    static update(accountUUID, name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _block = yield BlockController.fetchBlock(accountUUID, name);
                yield _block.update(data);
                const _blockDetails = _block.sanitize();
                logger.info(`Updating block ${name} in account: ${accountUUID}`);
                return _blockDetails;
            }
            catch (error) {
                logger.error(`Block update failed: ${error.message}, account: ${accountUUID}`);
                throw error;
            }
        });
    }
    static delete(accountUUID, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _block = yield BlockController.fetchBlock(accountUUID, name);
                logger.info(`Removing block from account: ${accountUUID}`);
                yield _block.delete();
                return `${name} was removed from your Pantry!`;
            }
            catch (error) {
                logger.error(`Block deletion failed: ${error.message}, account: ${accountUUID}`);
                throw error;
            }
        });
    }
    static fetchBlock(accountUUID, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const _account = yield account_1.default.get(accountUUID);
            try {
                const _block = yield block_1.default.get(accountUUID, name);
                return _block;
            }
            catch (error) {
                yield _account.saveError(error.message);
                throw error;
            }
        });
    }
}
exports.default = BlockController;
