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
exports.verify = void 0;
// External Libs
const axios_1 = require("axios");
require('dotenv').config();
// External Files
const environment = require("./environment");
const logger_1 = require("./logger");
// Logger setup
const logger = new logger_1.default('ReCaptcha');
const _baseURL = 'https://www.google.com/recaptcha/api';
function verify(response) {
    return __awaiter(this, void 0, void 0, function* () {
        if (environment.isDevelopment()) {
            return true;
        }
        try {
            const { data } = yield (0, axios_1.default)({
                method: 'POST',
                params: {
                    response,
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                },
                url: `${_baseURL}/siteverify`,
            });
            const { success } = data;
            return success;
        }
        catch (error) {
            logger.error(`Error when attempting to verify recaptcha: ${error.message}`);
            return false;
        }
    });
}
exports.verify = verify;
