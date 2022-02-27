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
const axios_1 = require("axios");
const pino = require("pino");
require('dotenv').config();
// External Files
const logger_1 = require("../interfaces/logger");
const environment = require("./environment");
class Logger {
    constructor(name) {
        this.slackWebhook = process.env.SLACK_LOG_WEBHOOK;
        this.logClient = pino({
            name,
            prettyPrint: true,
        });
    }
    logAndSlack(message, object) {
        this.sendToClient(logger_1.ILogLevel.info, message, object, true);
    }
    info(message, object) {
        this.sendToClient(logger_1.ILogLevel.info, message, object);
    }
    warn(message, object) {
        this.sendToClient(logger_1.ILogLevel.warn, message, object);
    }
    error(message, object) {
        this.sendToClient(logger_1.ILogLevel.error, message, object);
    }
    // Send logs to not only the logging client, but also outbound to Slack.
    sendToClient(level, message, object, postToSlack = false) {
        if (object && Object.keys(object).length !== 0) {
            this.logClient[level](message, object);
        }
        else {
            this.logClient[level](message);
        }
        if (level !== logger_1.ILogLevel.info || postToSlack) {
            this.postToSlack(level, message);
        }
    }
    postToSlack(level, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (environment.isDevelopment()) {
                    return;
                }
                if (this.slackWebhook === undefined) {
                    throw new Error('No Webhook Found');
                }
                const _time = new Date().toLocaleTimeString();
                const _message = `${_time} ${level.toUpperCase()} - ${message}`;
                yield (0, axios_1.default)({
                    method: 'POST',
                    data: { text: _message },
                    url: this.slackWebhook,
                });
            }
            catch (error) {
                this.logClient.error(`Could not post to Slack: ${error.message}`);
            }
        });
    }
}
exports.default = Logger;
