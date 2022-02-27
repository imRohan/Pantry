"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const merge = require("deepmerge");
// External Files
const block_1 = require("../decorators/block");
const dataStore = require("../services/dataStore");
class Block {
    constructor(accountUUID, name, payload) {
        // Constants
        this.lifeSpanDays = Number(process.env.BLOCK_LIFESPAN);
        this.lifeSpan = Number(86400 * this.lifeSpanDays);
        this.name = name;
        this.payload = payload;
        this.accountUUID = accountUUID;
    }
    static get(accountUUID, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const _blockKey = Block.generateRedisKey(accountUUID, name);
            const _stringifiedBlock = yield dataStore.get(_blockKey);
            if (!_stringifiedBlock) {
                throw new Error(`${name} does not exist`);
            }
            const _blockContents = Block.convertRedisPayload(_stringifiedBlock);
            const { payload } = _blockContents;
            const _block = new Block(accountUUID, name, payload);
            yield _block.refreshTTL();
            return _block;
        });
    }
    static convertRedisPayload(stringifiedBlock) {
        const _block = JSON.parse(stringifiedBlock);
        return _block;
    }
    static generateRedisKey(accountUUID, name) {
        return `account:${accountUUID}::block:${name}`;
    }
    store() {
        return __awaiter(this, void 0, void 0, function* () {
            const _errors = yield (0, class_validator_1.validate)(this);
            if (_errors.length > 0) {
                throw new Error(`Validation failed: ${_errors}`);
            }
            const _blockKey = Block.generateRedisKey(this.accountUUID, this.name);
            const _stringifiedBlock = this.generateRedisPayload();
            yield dataStore.set(_blockKey, _stringifiedBlock, this.lifeSpan);
        });
    }
    update(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const _updatedPayload = merge(this.payload, newData);
            this.payload = _updatedPayload;
            yield this.store();
            return (_updatedPayload);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const _blockKey = Block.generateRedisKey(this.accountUUID, this.name);
            yield dataStore.remove(_blockKey);
        });
    }
    refreshTTL() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.store();
        });
    }
    sanitize() {
        return this.payload;
    }
    generateRedisPayload() {
        const _payload = {
            accountUUID: this.accountUUID,
            name: this.name,
            payload: this.payload,
        };
        return JSON.stringify(_payload);
    }
}
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
exports.default = Block;
