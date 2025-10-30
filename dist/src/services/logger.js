"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// External Libs
const pino = require("pino");
require('dotenv').config();
// External Files
const logger_1 = require("../interfaces/logger");
class Logger {
    constructor(name) {
        this.logClient = this.buildLogClient(name);
    }
    logAndSlack(message, object) {
        this.sendToClient(logger_1.ILogLevel.info, message, object);
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
    buildLogClient(name) {
        return pino({ name, prettyPrint: true });
    }
    // Send logs to not only the logging client, but also outbound to Slack.
    sendToClient(level, message, object) {
        if (object && Object.keys(object).length !== 0) {
            this.logClient[level](message, object);
        }
        else {
            this.logClient[level](message);
        }
    }
}
exports.default = Logger;
