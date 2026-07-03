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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const environment = __importStar(require("./environment"));
const logger_1 = __importDefault(require("./logger"));
const logger = new logger_1.default('Mailer');
class Mailer {
    static sendWelcomeEmail(email, pantryID, pantryName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (environment.isDevelopment()) {
                return;
            }
            try {
                yield (0, axios_1.default)({
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    url: this.plunkEndpoint,
                    data: {
                        to: email,
                        template: this.welcomeEmailId,
                        data: { pantryID, pantryName },
                    },
                });
                logger.info(`Sent a welcome email to ${email}`);
            }
            catch (error) {
                logger.error(`Sending welcome email failed: ${error.message}`);
            }
        });
    }
}
Mailer.apiKey = process.env.MAILER_API_KEY;
Mailer.plunkEndpoint = 'https://next-api.useplunk.com/v1/send';
Mailer.welcomeEmailId = process.env.WELCOME_EMAIL_ID;
exports.default = Mailer;
