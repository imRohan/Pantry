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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// External Files
const account_1 = __importDefault(require("../models/account"));
const block_1 = __importDefault(require("../models/block"));
const logger_1 = __importDefault(require("../services/logger"));
// Logger setup
const logger = new logger_1.default('Block Controller');
class BlockController {
    static create(accountUUID, name, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info(`Creating block ${name} in account: ${accountUUID}`);
                const _account = yield account_1.default.get(accountUUID);
                const _accountFull = yield _account.checkIfFull();
                if (_accountFull) {
                    const _errorMessage = 'max number of baskets reached';
                    throw new Error(_errorMessage);
                }
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
                logger.info(`Retrieving block: ${name} in account: #{accountUUID}`);
                const _block = yield block_1.default.get(accountUUID, name);
                const _blockDetails = _block.sanitize();
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
                logger.info(`Updating block ${name} in account: ${accountUUID}`);
                const _block = yield block_1.default.get(accountUUID, name);
                yield _block.update(data);
                const _blockDetails = _block.sanitize();
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
                logger.info(`Removing block ${name} from account: ${accountUUID}`);
                const _block = yield block_1.default.get(accountUUID, name);
                yield _block.delete();
                return `${name} was removed from your Pantry!`;
            }
            catch (error) {
                logger.error(`Block deletion failed: ${error.message}, account: ${accountUUID}`);
                throw error;
            }
        });
    }
}
exports.default = BlockController;
