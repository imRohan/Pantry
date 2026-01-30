"use strict";
// Extarnal Libs
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const crm = __importStar(require("../services/crm"));
const logger_1 = __importDefault(require("../services/logger"));
const mailer = __importStar(require("../services/mailer"));
const recaptcha = __importStar(require("../services/recaptcha"));
// Logger setup
const logger = new logger_1.default('Account Controller');
class AccountController {
    static create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { recaptchaResponse } = params;
                const _verified = yield recaptcha.verify(recaptchaResponse);
                if (!_verified) {
                    throw new Error('ReCaptcha Failed');
                }
                const _account = new account_1.default(params);
                const _accountUUID = yield _account.store();
                const { contactEmail } = params;
                yield mailer.sendWelcomeEmail(contactEmail, _accountUUID);
                crm.addNewUser(contactEmail, _accountUUID);
                logger.logAndSlack(`Account created for ${contactEmail}: ${_accountUUID}`);
                return _accountUUID;
            }
            catch (error) {
                logger.error(`Account creation failed: ${error.message}`);
                throw error;
            }
        });
    }
    static update(uuid, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _account = yield account_1.default.get(uuid);
                yield _account.update(data);
                const _accountDetails = _account.sanitize();
                logger.info('Account updated');
                return _accountDetails;
            }
            catch (error) {
                logger.error(`Account update failed: ${error.message}`);
                throw error;
            }
        });
    }
    static get(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _account = yield account_1.default.get(uuid);
                const _accountDetails = _account.sanitize();
                logger.info('Account retrieved');
                return _accountDetails;
            }
            catch (error) {
                logger.error(`Account retrieval failed: ${error.message}`);
                throw error;
            }
        });
    }
    static delete(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _account = yield account_1.default.get(uuid);
                const _blocks = yield _account.getBlocks();
                logger.info(`Deleting account: ${uuid}`);
                for (const _item of _blocks) {
                    const { name } = _item;
                    logger.info(`Deleting block ${name} in account: ${uuid}`);
                    const _block = yield block_1.default.get(uuid, name);
                    yield _block.delete();
                }
                yield _account.delete();
                logger.info(`Account: ${uuid} deleted`);
                return 'Your Pantry has been deleted!';
            }
            catch (error) {
                logger.error(`Account deletion failed: ${error.message}`);
                throw error;
            }
        });
    }
}
exports.default = AccountController;
