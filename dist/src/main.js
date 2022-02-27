#!/usr/bin/env node
"use strict";
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
const apiV1_1 = require("./routes/apiV1");
const systemV1_1 = require("./routes/systemV1");
// External files
const environment = require("./services/environment");
const logger_1 = require("./services/logger");
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
