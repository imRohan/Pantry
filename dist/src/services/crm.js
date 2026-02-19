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
const logger = new logger_1.default('CRM');
class Crm {
    static addNewUser(email, pantryId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (environment.isDevelopment()) {
                return;
            }
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
