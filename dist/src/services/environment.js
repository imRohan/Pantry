"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopment = void 0;
function isDevelopment() {
    const _devEnvironments = ['development', 'test'];
    const _currentEnvironment = process.env.NODE_ENV;
    return _devEnvironments.includes(_currentEnvironment);
}
exports.isDevelopment = isDevelopment;
