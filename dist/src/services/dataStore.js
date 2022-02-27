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
exports.ttl = exports.ping = exports.scan = exports.find = exports.remove = exports.set = exports.get = void 0;
// External Libs
const crypto = require("crypto");
const util_1 = require("util");
const redis = require("redis");
// External Files
const logger_1 = require("./logger");
// Logger setup
const logger = new logger_1.default('Redis');
// Crypto setup
const _crypto = {
    algorithm: 'aes-256-cbc',
    key: process.env.CRYPTO_KEY,
    iv: process.env.CRYPTO_IV,
};
function get(key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _redisClient = redis.createClient();
            const _get = (0, util_1.promisify)(_redisClient.get).bind(_redisClient);
            const _storedPayloadString = yield _get(key);
            _redisClient.quit();
            if (_storedPayloadString) {
                const _encryptedPayload = Buffer.from(_storedPayloadString, 'hex');
                const _decipher = crypto.createDecipheriv(_crypto.algorithm, Buffer.from(_crypto.key), Buffer.from(_crypto.iv));
                let _decryptedPayload = _decipher.update(_encryptedPayload);
                _decryptedPayload = Buffer.concat([_decryptedPayload, _decipher.final()]);
                return _decryptedPayload;
            }
            return;
        }
        catch (error) {
            logger.error(`Error when getting key: ${error.message}`);
            throw new Error('Pantry is having critical issues');
        }
    });
}
exports.get = get;
function set(key, payload, lifespan) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _cipher = crypto.createCipheriv(_crypto.algorithm, Buffer.from(_crypto.key), _crypto.iv);
            let _encryptedPayload = _cipher.update(payload);
            _encryptedPayload = Buffer.concat([_encryptedPayload, _cipher.final()]);
            const _encryptedPayloadString = _encryptedPayload.toString('hex');
            const _redisClient = redis.createClient();
            const _set = (0, util_1.promisify)(_redisClient.set).bind(_redisClient);
            yield _set(key, _encryptedPayloadString, 'EX', lifespan);
            _redisClient.quit();
        }
        catch (error) {
            logger.error(`Error when setting key: ${error.message}`);
            throw new Error('Pantry is having critical issues');
        }
    });
}
exports.set = set;
function remove(key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _redisClient = redis.createClient();
            const _delete = (0, util_1.promisify)(_redisClient.del).bind(_redisClient);
            yield _delete(key);
            _redisClient.quit();
        }
        catch (error) {
            logger.error(`Error when deleting a key: ${error.message}`);
            throw new Error('Pantry is having critical issues');
        }
    });
}
exports.remove = remove;
function find(pattern) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _redisClient = redis.createClient();
            const _keys = (0, util_1.promisify)(_redisClient.keys).bind(_redisClient);
            const _storedKeys = yield _keys(pattern);
            _redisClient.quit();
            return _storedKeys;
        }
        catch (error) {
            logger.error(`Error when finding keys: ${error.message}`);
            throw new Error('Pantry is having critical issues');
        }
    });
}
exports.find = find;
function scan(cursor, pattern, count, type) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _args = [cursor];
            if (pattern) {
                _args.push('MATCH', pattern);
            }
            if (count) {
                _args.push('COUNT', count);
            }
            if (type) {
                _args.push('TYPE', type);
            }
            const _redisClient = redis.createClient();
            const _scan = (0, util_1.promisify)(_redisClient.scan).bind(_redisClient);
            const _storedKeys = yield _scan(..._args);
            _redisClient.quit();
            return _storedKeys;
        }
        catch (error) {
            logger.error(`Error when scanning: ${error.message}`);
            throw new Error('Pantry is having critical issues');
        }
    });
}
exports.scan = scan;
function ping() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _redisClient = redis.createClient();
            const _ping = (0, util_1.promisify)(_redisClient.ping).bind(_redisClient);
            const _response = yield _ping();
            _redisClient.quit();
            return _response === 'PONG';
        }
        catch (error) {
            logger.error(`Error when pinging redis: ${error.message}`);
            return false;
        }
    });
}
exports.ping = ping;
function ttl(key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _redisClient = redis.createClient();
            const _ttl = (0, util_1.promisify)(_redisClient.ttl).bind(_redisClient);
            const _response = yield _ttl(key);
            _redisClient.quit();
            return _response;
        }
        catch (error) {
            logger.error(`Error when fetching ttl: ${error.message}`);
            return -1;
        }
    });
}
exports.ttl = ttl;
