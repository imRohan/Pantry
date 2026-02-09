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
const express = require("express");
const logger_1 = __importDefault(require("../services/logger"));
const clientValidator_1 = __importDefault(require("../services/clientValidator"));
const system_1 = __importDefault(require("../controllers/system"));
const logger = new logger_1.default('API');
const _systemV1Router = express.Router();
_systemV1Router.get('/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger.info('[GET] Service Status');
        if (clientValidator_1.default.validate(req)) {
            const _stats = yield system_1.default.getStatus();
            res.send(_stats);
        }
        else {
            logger.warn('Unauthorized client');
            res.status(401).send('Unauthorized');
        }
    }
    catch (error) {
        res.status(400).send(`Could not get system status: ${error.message}`);
    }
}));
exports.default = _systemV1Router;
