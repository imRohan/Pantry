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
exports.addNewUser = void 0;
// External Libs
const AirTable = require("airtable");
// External Files
const environment = require("./environment");
const logger_1 = require("./logger");
// Logger setup
const logger = new logger_1.default('AirTable');
function addNewUser(email, pantryID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (environment.isDevelopment()) {
            return;
        }
        try {
            const _table = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE);
            yield _table('Users').create({
                Email: email,
                PantryId: pantryID,
                DateCreated: new Date(),
            });
            logger.info('Saved user details');
        }
        catch (error) {
            logger.error(`Error when adding new user: ${error.message}`);
        }
    });
}
exports.addNewUser = addNewUser;
