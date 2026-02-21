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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// Extarnal Libs
const class_validator_1 = require("class-validator");
const merge = require("deepmerge");
// External Files
const block_1 = require("../decorators/block");
const dataStore = __importStar(require("../services/dataStore"));
const account_1 = __importDefault(require("./account"));
class Block {
    constructor(accountUUID, name, payload) {
        this.name = name;
        this.payload = payload;
        this.accountUUID = accountUUID;
        this.redisKey = `account:${this.accountUUID}::block:${this.name}`;
        this.account = null;
    }
    static get(accountUUID, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const _block = new Block(accountUUID, name, null);
            yield _block.hydrate();
            yield _block.refreshTTL();
            return _block;
        });
    }
    store() {
        return __awaiter(this, void 0, void 0, function* () {
            const _errors = yield (0, class_validator_1.validate)(this);
            if (_errors.length > 0) {
                throw new Error(`Validation failed: ${_errors}`);
            }
            const _stringifiedBlock = this.generateRedisPayload();
            yield dataStore.set(this.redisKey, _stringifiedBlock, Block.lifeSpan);
        });
    }
    update(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const _updatedPayload = merge(this.payload, newData);
            this.payload = _updatedPayload;
            yield this.store();
            return _updatedPayload;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield dataStore.remove(this.redisKey);
        });
    }
    refreshTTL() {
        return __awaiter(this, void 0, void 0, function* () {
            yield dataStore.refreshTTL(this.redisKey, Block.lifeSpan);
        });
    }
    sanitize() {
        return Object.assign({}, this.payload);
    }
    verifyAccountNotFull() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hydrateAccount();
            yield this.account.verifyIfFull();
        });
    }
    generateRedisPayload() {
        const _payload = {
            accountUUID: this.accountUUID,
            name: this.name,
            payload: this.payload,
        };
        return JSON.stringify(_payload);
    }
    hydrate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hydrateAccount();
            const _stringifiedBlock = yield dataStore.get(this.redisKey);
            if (!_stringifiedBlock) {
                throw new Error(`${this.name} does not exist`);
            }
            const _blockContents = JSON.parse(_stringifiedBlock);
            const { payload } = _blockContents;
            this.payload = payload;
        });
    }
    hydrateAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.account = yield account_1.default.get(this.accountUUID);
        });
    }
}
_a = Block;
Block.lifeSpanDays = Number(process.env.BLOCK_LIFESPAN);
Block.lifeSpan = Number(86400 * _a.lifeSpanDays);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], Block.prototype, "accountUUID", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], Block.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsObject)(),
    (0, block_1.IsValidPayloadSize)()
], Block.prototype, "payload", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)()
], Block.prototype, "account", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], Block.prototype, "redisKey", void 0);
exports.default = Block;
