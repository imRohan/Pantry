#!/usr/bin/env node
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Get External Deps
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
require('dotenv').config();
// Setup Express
const app = express();
const server = http.createServer(app);
// Routes
const apiV1_1 = __importDefault(require("./routes/apiV1"));
const systemV1_1 = __importDefault(require("./routes/systemV1"));
// External files
const environment = __importStar(require("./services/environment"));
const logger_1 = __importDefault(require("./services/logger"));
// Logger setup
const logger = new logger_1.default('API');
// Express server setup and start
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(__dirname));
app.use(helmet());
// Routes
app.use('/apiv1/system', systemV1_1.default);
app.use('/apiv1/pantry', apiV1_1.default);
app.get('/', (request, response) => {
    logger.info('Served Landing Page');
    response.sendFile('index.html', { root: process.env.PWD });
});
function startApplication() {
    // Start the Express Server & Init the application
    const _port = process.env.API_SERVER_PORT;
    const _baseMessage = `Pantry is now running on port ${_port}`;
    let _bootMessage = _baseMessage;
    if (environment.isDevelopment()) {
        _bootMessage = `${_baseMessage} in DEVELOPMENT MODE`;
    }
    const _serverInstance = server.listen(process.env.API_SERVER_PORT, () => {
        logger.warn(_bootMessage);
    });
    process.on('SIGINT', () => {
        logger.warn('Pantry shutting down...');
        _serverInstance.close();
    });
}
startApplication();
