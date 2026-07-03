"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientValidator {
    constructor(authHeader) {
        this.internalClientToken = process.env.INTERNAL_CLIENT_TOKEN;
        this.authHeader = authHeader;
    }
    static validate(request) {
        const _validator = ClientValidator.factory(request);
        return _validator.validate();
    }
    static factory(request) {
        return new ClientValidator(request.get('Authorization'));
    }
    validate() {
        if (!this.authHeader || !this.internalClientToken) {
            return false;
        }
        const [, _token] = this.authHeader.split(' ');
        return _token === this.internalClientToken;
    }
}
exports.default = ClientValidator;
