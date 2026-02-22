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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// External Libs
const express = require("express");
const expressBrute = require("express-brute");
const redisStore = require("express-brute-redis");
// External Files
const account_1 = __importDefault(require("../controllers/account"));
const block_1 = __importDefault(require("../controllers/block"));
const publicBlock_1 = __importDefault(require("../controllers/publicBlock"));
const logger_1 = __importDefault(require("../services/logger"));
// Logger setup
const logger = new logger_1.default('API');
// Express Brute setup (1 request per 1/2 sec)
const store = new redisStore();
const failCallback = (req, res, next, nextValid) => {
    const message = `Please wait till ${nextValid} to make future requests`;
    res.status(429).send(`Pantry API limit reached. ${message}`);
};
const bruteForce = new expressBrute(store, {
    failCallback,
    freeRetries: 5,
    minWait: 9000,
    maxWait: 9000,
    lifetime: 10,
    refreshTimeoutOnRequest: false,
});
// Router setup
const _apiV1Router = express.Router();
_apiV1Router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        logger.info('[POST] Create Account', body);
        const _newAccountUUID = yield account_1.default.create(body);
        res.send(_newAccountUUID);
    }
    catch (error) {
        res.status(400).json({ error: 'Could not create new pantry',
            details: error.message });
    }
}));
_apiV1Router.put('/:pantryID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const { pantryID } = accountParams(req);
        logger.info('[PUT] Update Pantry', { pantryID });
        const _response = yield account_1.default.update(pantryID, body);
        res.send(_response);
    }
    catch (error) {
        res.status(400).json({ error: 'Could not update pantry',
            details: error.message });
    }
}));
_apiV1Router.get('/:pantryID', bruteForce.getMiddleware({
    key: (req, res, next) => {
        const { pantryID } = accountParams(req);
        next(pantryID);
    },
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pantryID } = accountParams(req);
        logger.info('[GET] Get Account', { pantryID });
        const _account = yield account_1.default.get(pantryID);
        res.send(_account);
    }
    catch (error) {
        res.status(400).json({ error: 'Could not get pantry',
            details: error.message });
    }
}));
_apiV1Router.delete('/:pantryID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pantryID } = accountParams(req);
        logger.info('[DELETE] Delete Account', { pantryID });
        yield account_1.default.delete(pantryID);
        res.status(204);
    }
    catch (error) {
        res.status(400).json({ error: 'Could not delete pantry',
            details: error.message });
    }
}));
_apiV1Router.post('/:pantryID/basket/:basketName', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const { pantryID, basketName } = basketParams(req);
        logger.info('[POST] Create Basket', { pantryID, basketName });
        const _response = yield block_1.default.create(pantryID, basketName, body);
        res.send(_response);
    }
    catch (error) {
        res.status(400).json({ error: 'Could not create basket',
            details: error.message });
    }
}));
_apiV1Router.put('/:pantryID/basket/:basketName', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const { pantryID, basketName } = basketParams(req);
        logger.info('[PUT] Update Basket', { pantryID, basketName });
        const _response = yield block_1.default.update(pantryID, basketName, body);
        res.send(_response);
    }
    catch (error) {
        res.status(400).json({ error: 'Could not update basket',
            details: error.message });
    }
}));
_apiV1Router.get('/:pantryID/basket/:basketName', bruteForce.getMiddleware({
    key: (req, res, next) => {
        const { pantryID } = accountParams(req);
        next(pantryID);
    },
}), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pantryID, basketName } = basketParams(req);
        logger.info('[GET] Get Basket', { pantryID, basketName });
        const _response = yield block_1.default.get(pantryID, basketName);
        res.send(_response);
    }
    catch (error) {
        res.status(400).json({ error: 'Could not get basket',
            details: error.message });
    }
}));
_apiV1Router.delete('/:pantryID/basket/:basketName', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pantryID, basketName } = basketParams(req);
        logger.info('[DELETE] Basket', { pantryID, basketName });
        const _response = yield block_1.default.delete(pantryID, basketName);
        res.send(_response);
    }
    catch (error) {
        res.status(400).json({ error: 'Could not delete basket',
            details: error.message });
    }
}));
_apiV1Router.get('/:pantryID/basket/:basketName/public', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pantryID, basketName } = publicBasketParams(req);
        logger.info(`[GET] Create Public Basket for ${pantryID}, ${basketName}`);
        const _newPublicBasketUUID = yield publicBlock_1.default.create(pantryID, basketName);
        res.send(_newPublicBasketUUID);
    }
    catch (error) {
        res.status(400).json({ error: 'Could create public basket',
            details: error.message });
    }
}));
function basketParams(req) {
    const { params } = req;
    const { pantryID, basketName } = params;
    return { pantryID, basketName };
}
function accountParams(req) {
    const { params } = req;
    const { pantryID } = params;
    return { pantryID };
}
function publicBasketParams(req) {
    const { params } = req;
    const { pantryID, basketName, publicBasketID } = params;
    return { pantryID, basketName, publicBasketID };
}
exports.default = _apiV1Router;
