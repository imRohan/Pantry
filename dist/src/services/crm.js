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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("./logger"));
const logger = new logger_1.default('CRM');
class Crm {
    static addNewUser(email, pantryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _url = `${this.airtableBaseURL}/${this.baseID}/${this.tableID}`;
                yield (0, axios_1.default)({
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json',
                    },
                    url: _url,
                    data: {
                        records: [
                            {
                                fields: {
                                    Email: email,
                                    PantryId: pantryId,
                                    DateCreated: new Date(),
                                },
                            },
                        ],
                    },
                });
                logger.info(`Saved user to table ${this.tableID}`);
            }
            catch (error) {
                logger.error(`Error when saving new user: ${error.message}`);
            }
        });
    }
}
Crm.baseID = process.env.AIRTABLE_BASE_ID;
Crm.tableID = process.env.AIRTABLE_TABLE_ID;
Crm.apiToken = process.env.AIRTABLE_API_TOKEN;
Crm.airtableBaseURL = 'https://api.airtable.com/v0';
exports.default = Crm;
