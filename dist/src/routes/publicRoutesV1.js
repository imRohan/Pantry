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
// External Files
const publicBlock_1 = __importDefault(require("../controllers/publicBlock"));
const logger_1 = __importDefault(require("../services/logger"));
// Logger setup
const logger = new logger_1.default('API');
// Router setup
const _publicV1Router = express.Router();
_publicV1Router.get('/:publicBasketID', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params } = req;
        const { publicBasketID } = params;
        logger.info('[GET] Get Public Basket', { publicBasketID });
        const _basket = yield publicBlock_1.default.get(publicBasketID);
        res.send(_basket);
    }
    catch (error) {
        res.status(400).send(`Could not get Public Basket: ${error.message}`);
    }
}));
exports.default = _publicV1Router;
