"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopment = void 0;
function isDevelopment() {
    const _environment = process.env.NODE_ENV;
    return _environment === 'development';
}
exports.isDevelopment = isDevelopment;
