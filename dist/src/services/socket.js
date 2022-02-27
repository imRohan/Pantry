"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// External Deps
const socketIo = require('socket.io');
class SocketServer {
    constructor(server) {
        this.io = socketIo(server);
        this.io.on('connection', (socket) => {
            socket.emit('connected', 'connected');
        });
    }
    accountUpdated(pantryID) {
        this.emit(`${pantryID}-updated`, 'Pantry updated');
    }
    emit(event, body) {
        this.io.emit(event, body);
    }
}
exports.default = SocketServer;
