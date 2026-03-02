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
class EventTracker {
    constructor(plunkEvent) {
        this.apiKey = process.env.EVENT_TRACKING_API_KEY;
        this.plunkEndpoint = 'https://next-api.useplunk.com/v1/track';
        this.logger = new logger_1.default('Event Tracker');
        const { email, event, data } = plunkEvent;
        this.email = email;
        this.event = event;
        this.data = data;
    }
    static trackSignup(email, pantryID, pantryName) {
        const _event = {
            email,
            event: 'pantry.created',
            data: { pantryID, pantryName },
        };
        void new EventTracker(_event).track();
    }
    track() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, axios_1.default)({
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    url: this.plunkEndpoint,
                    data: { email: this.email, event: this.event, data: this.data },
                });
                this.logger.info(`Successfully tracked event ${this.event} for ${this.email}`);
            }
            catch (error) {
                this.logger.info(`Failed to track event ${this.event} for ${this.email}: ${error}`);
            }
        });
    }
}
exports.default = EventTracker;
