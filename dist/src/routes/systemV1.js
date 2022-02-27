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
// External Libs
const express = require("express");
// External Files
const system_1 = require("../controllers/system");
const logger_1 = require("../services/logger");
// Logger setup
const logger = new logger_1.default('API');
// Router setup
const _systemV1Router = express.Router();
_systemV1Router.get('/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger.info('[GET] Service Status');
        const _status = yield system_1.default.getStatus();
        res.send(_status);
    }
    catch (error) {
        res.status(400).send(`Could not create new pantry: ${error.message}`);
    }
}));
exports.default = _systemV1Router;
