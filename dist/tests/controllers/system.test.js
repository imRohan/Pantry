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
// External Files
const system_1 = require("../../src/controllers/system");
const dataStore = require("../../src/services/dataStore");
jest.mock('../../src/services/dataStore');
const mockedDataStore = dataStore;
afterEach(() => {
    mockedDataStore.get.mockReset();
    jest.clearAllMocks();
});
describe('When fetching system status', () => {
    it('returns the system status', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedDataStore.ping.mockReturnValueOnce(Promise.resolve(true));
        mockedDataStore.scan
            .mockReturnValueOnce(Promise.resolve(['0', ['account:00000000-0000-0000-0000-000000000000']]))
            .mockReturnValueOnce(Promise.resolve(['0', ['account:00000000-0000-0000-0000-000000000000']]));
        const _status = yield system_1.default.getStatus();
        expect(_status).toMatchObject({
            api: true,
            website: true,
            dataStore: true,
            activeAccounts: 1,
        });
    }));
    it('detects offline dataStore', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedDataStore.ping.mockReturnValueOnce(Promise.resolve(false));
        const _status = yield system_1.default.getStatus();
        const { dataStore: redis } = _status;
        expect(redis).toBe(false);
    }));
    it('returns a negative status if error is thrown', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedDataStore.ping.mockReturnValueOnce(Promise.reject('error'));
        const _status = yield system_1.default.getStatus();
        expect(_status).toMatchObject({
            api: true,
            website: true,
            dataStore: false,
        });
    }));
});
