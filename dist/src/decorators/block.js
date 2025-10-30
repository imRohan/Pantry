"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidPayloadSize = void 0;
const class_validator_1 = require("class-validator");
function IsValidPayloadSize() {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidPayloadSize',
            target: object.constructor,
            propertyName,
            validator: {
                validate(value) {
                    // In MB
                    const MAX_PAYLOAD_SIZE = 1.44;
                    const _payloadString = JSON.stringify(value);
                    // eslint-disable-next-line
                    const _size = ~-encodeURI(_payloadString).split(/%..|./).length;
                    const MAX_PAYLOAD_SIZE_BYTES = MAX_PAYLOAD_SIZE * 1024000;
                    return _size <= MAX_PAYLOAD_SIZE_BYTES;
                },
            },
        });
    };
}
exports.IsValidPayloadSize = IsValidPayloadSize;
