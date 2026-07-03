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
const publicBlock_1 = __importDefault(require("../models/publicBlock"));
const logger_1 = __importDefault(require("../services/logger"));
// Logger setup
const logger = new logger_1.default('Public Block Controller');
class PublicBlockController {
    static create(pantryID, basketName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _publicBlock = new publicBlock_1.default(pantryID, basketName);
                const _publicBlockUUID = yield _publicBlock.store();
                logger.info(`Public Block created: ${_publicBlockUUID}`);
                return _publicBlockUUID;
            }
            catch (error) {
                logger.error(`Public Block creation failed: ${error.message}`);
                throw error;
            }
        });
    }
    static get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _publicBlock = yield publicBlock_1.default.get(id);
                logger.info(`Public Block retrieved: ${id}`);
                return _publicBlock.sanitizedBlock();
            }
            catch (error) {
                logger.error(`Public Block retrieval failed: ${error.message}`);
                throw error;
            }
        });
    }
}
exports.default = PublicBlockController;
