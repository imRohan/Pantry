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
exports.sendAccountErrorsEmail = exports.sendWelcomeEmail = void 0;
// External Libs
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// External Files
const environment = require("./environment");
const logger_1 = require("./logger");
// Logger setup
const logger = new logger_1.default('Mailer');
function sendWelcomeEmail(email, pantryID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (environment.isDevelopment()) {
            return;
        }
        try {
            const _email = {
                to: email,
                from: 'noreply@getpantry.cloud',
                templateId: process.env.WELCOME_EMAIL_ID,
                dynamic_template_data: { pantryID },
            };
            logger.info(`Sending welcome email to ${email}`);
            yield sgMail.send(_email);
        }
        catch (error) {
            logger.error(`Sending welcome email failed: ${error.message}`);
        }
    });
}
exports.sendWelcomeEmail = sendWelcomeEmail;
function sendAccountErrorsEmail(errorMessage, email, pantryID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _email = {
                to: email,
                from: 'noreply@getpantry.cloud',
                templateId: process.env.ACCOUNT_ERRORS_EMAIL_ID,
                dynamic_template_data: { pantryID, errorMessage },
            };
            logger.info(`Sending account errors email to ${email}`);
            yield sgMail.send(_email);
        }
        catch (error) {
            logger.error(`Sending account errors email  failed: ${error.message}`);
        }
    });
}
exports.sendAccountErrorsEmail = sendAccountErrorsEmail;
