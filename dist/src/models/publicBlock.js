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
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const class_validator_1 = require("class-validator");
const dataStore = __importStar(require("../services/dataStore"));
const block_1 = __importDefault(require("./block"));
class PublicBlock {
    constructor(accountUUID, blockName, id = null) {
        this.lifeSpanDays = Number(process.env.BLOCK_LIFESPAN);
        this.lifeSpan = Number(86400 * this.lifeSpanDays);
        this.accountUUID = accountUUID;
        this.blockName = blockName;
        this.id = id !== null && id !== void 0 ? id : this.generateHash();
        this.redisKey = `public_block:${this.id}`;
        this.block = null;
    }
    static get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const _publicBlock = new PublicBlock(null, null, id);
            yield _publicBlock.hydrate();
            yield _publicBlock.saveToRedis();
            return _publicBlock;
        });
    }
    static getTotalNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const _keysPerScan = 10000;
            const _pattern = '*public_block:*';
            let _total = 0;
            let _nextCursor = 0;
            do {
                const [_cursor, _results] = yield dataStore.scan(_nextCursor, _pattern, _keysPerScan);
                _total += _results.length;
                _nextCursor = parseInt(_cursor, 10);
            } while (_nextCursor !== 0);
            return _total;
        });
    }
    store() {
        return __awaiter(this, void 0, void 0, function* () {
            const _errors = yield (0, class_validator_1.validate)(this);
            if (_errors.length > 0) {
                throw new Error(`Validation failed: ${_errors}`);
            }
            yield this.refreshBlock();
            yield this.saveToRedis();
            return this.id;
        });
    }
    saveToRedis() {
        return __awaiter(this, void 0, void 0, function* () {
            const _stringifiedPublicBlock = this.generateRedisPayload();
            yield dataStore.set(this.redisKey, _stringifiedPublicBlock, this.lifeSpan);
        });
    }
    hydrate() {
        return __awaiter(this, void 0, void 0, function* () {
            const _stringifiedPublicBlock = yield dataStore.get(this.redisKey);
            if (!_stringifiedPublicBlock) {
                throw new Error(`${this.id} does not exist`);
            }
            const _publicBlockContents = JSON.parse(_stringifiedPublicBlock);
            const { accountUUID, blockName } = _publicBlockContents;
            this.accountUUID = accountUUID;
            this.blockName = blockName;
            yield this.refreshBlock();
        });
    }
    refreshBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.block = yield block_1.default.get(this.accountUUID, this.blockName);
            }
            catch (_a) {
                throw new Error('basket not found, please contact the Pantry owner');
            }
        });
    }
    generateHash() {
        const _key = `${this.accountUUID}${this.blockName}`;
        const _hash = crypto.createHash('md5').update(_key).digest('hex');
        return _hash;
    }
    generateRedisPayload() {
        const _publicBlock = {
            accountUUID: this.accountUUID,
            blockName: this.blockName,
            id: this.id,
        };
        return JSON.stringify(_publicBlock);
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], PublicBlock.prototype, "accountUUID", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], PublicBlock.prototype, "blockName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], PublicBlock.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)()
], PublicBlock.prototype, "redisKey", void 0);
exports.default = PublicBlock;
