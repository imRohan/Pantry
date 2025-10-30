"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
// Extarnal Libs
const class_validator_1 = require("class-validator");
const uuidv4 = require("uuid/v4");
// External Files
const dataStore = __importStar(require("../services/dataStore"));
const KEYS_PER_SCAN_ITERATION = 1000000;
class Account {
    constructor(params) {
        // Constants
        this.lifeSpanDays = Number(process.env.ACCOUNT_LIFESPAN);
        this.lifeSpan = Number(86400 * this.lifeSpanDays);
        this.defaultMaxNumberOfBlocks = 100;
        const { name, description, contactEmail, notifications, uuid, maxNumberOfBlocks, errors } = params;
        this.name = name;
        this.description = description;
        this.contactEmail = contactEmail;
        this.notifications = notifications !== null && notifications !== void 0 ? notifications : true;
        this.maxNumberOfBlocks = maxNumberOfBlocks !== null && maxNumberOfBlocks !== void 0 ? maxNumberOfBlocks : this.defaultMaxNumberOfBlocks;
        this.errors = errors !== null && errors !== void 0 ? errors : [];
        this.uuid = uuid !== null && uuid !== void 0 ? uuid : uuidv4();
    }
    static get(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const _accountKey = Account.generateRedisKey(uuid);
            const _stringifiedAccount = yield dataStore.get(_accountKey);
            if (!_stringifiedAccount) {
                throw new Error(`pantry with id: ${uuid} not found`);
            }
            const _accountParams = Account.convertRedisPayload(_stringifiedAccount);
            const _accountObject = new Account(_accountParams);
            yield _accountObject.refreshTTL();
            return _accountObject;
        });
    }
    static getTotalNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line max-len
            const _pattern = 'account:*-*-*-*-[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9]';
            let _total = 0;
            let _nextCursor = 0;
            do {
                const [_cursor, _results] = yield dataStore.scan(_nextCursor, _pattern, KEYS_PER_SCAN_ITERATION);
                _total += _results.length;
                _nextCursor = parseInt(_cursor, 10);
            } while (_nextCursor !== 0);
            return _total;
        });
    }
    static convertRedisPayload(stringifiedAccount) {
        const _account = JSON.parse(stringifiedAccount);
        return _account;
    }
    static generateRedisKey(uuid) {
        return `account:${uuid}`;
    }
    update(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, notifications } = newData;
            this.name = name !== null && name !== void 0 ? name : this.name;
            this.description = description !== null && description !== void 0 ? description : this.description;
            this.notifications = notifications !== null && notifications !== void 0 ? notifications : this.notifications;
            yield this.store();
        });
    }
    store() {
        return __awaiter(this, void 0, void 0, function* () {
            const _errors = yield (0, class_validator_1.validate)(this);
            if (_errors.length > 0) {
                throw new Error(`Validation failed: ${_errors}`);
            }
            const _accountKey = Account.generateRedisKey(this.uuid);
            const _stringifiedAccount = this.generateRedisPayload();
            yield dataStore.set(_accountKey, _stringifiedAccount, this.lifeSpan);
            return this.uuid;
        });
    }
    sanitize() {
        return __awaiter(this, void 0, void 0, function* () {
            const _baskets = yield this.getBlocks();
            const _percentFull = Math.round((_baskets.length / this.maxNumberOfBlocks) * 100);
            const _sanitizedItems = {
                name: this.name,
                description: this.description,
                errors: this.errors,
                notifications: this.notifications,
                percentFull: _percentFull,
                baskets: _baskets,
            };
            return _sanitizedItems;
        });
    }
    checkIfFull() {
        return __awaiter(this, void 0, void 0, function* () {
            const _blocks = yield this.getBlocks();
            const _isFull = _blocks.length === this.maxNumberOfBlocks;
            return _isFull;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const _accountKey = Account.generateRedisKey(this.uuid);
            yield dataStore.remove(_accountKey);
        });
    }
    refreshTTL() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.store();
        });
    }
    getBlocks() {
        return __awaiter(this, void 0, void 0, function* () {
            const _accountKey = Account.generateRedisKey(this.uuid);
            const _blockKeys = yield dataStore.find(`${_accountKey}::block:*`);
            const _blocks = yield Promise.all(_blockKeys.map((key) => __awaiter(this, void 0, void 0, function* () {
                const _ttl = yield dataStore.ttl(key);
                const _sanitizedName = key.split(':')[4];
                return ({ name: _sanitizedName, ttl: _ttl });
            })));
            return (_blocks);
        });
    }
    saveError(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const _date = new Date().toLocaleDateString();
            const _errorString = `${_date} - ${message}`;
            this.errors = [...this.errors, _errorString];
            yield this.store();
        });
    }
    generateRedisPayload() {
        const _accountDetails = {
            name: this.name,
            description: this.description,
            contactEmail: this.contactEmail,
            notifications: this.notifications,
            maxNumberOfBlocks: this.maxNumberOfBlocks,
            errors: this.errors,
            uuid: this.uuid,
        };
        return JSON.stringify(_accountDetails);
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], Account.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], Account.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)()
], Account.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)()
], Account.prototype, "notifications", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)()
], Account.prototype, "maxNumberOfBlocks", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)()
], Account.prototype, "errors", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4')
], Account.prototype, "uuid", void 0);
exports.default = Account;
