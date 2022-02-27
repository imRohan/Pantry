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
const block_1 = require("../../src/controllers/block");
const dataStore = require("../../src/services/dataStore");
const mailer = require("../../src/services/mailer");
jest.mock('../../src/services/dataStore');
jest.mock('../../src/services/mailer');
const mockedDataStore = dataStore;
// Constants
const _existingAccount = {
    name: 'Existing Account',
    description: 'Account made while testing',
    contactEmail: 'derp@flerp.com',
    maxNumberOfBlocks: 50,
    notifications: true,
    errors: [],
    uuid: '6dc70531-d0bf-4b3a-8265-b20f8a69e180',
};
const _existingBlock = {
    accountUUID: _existingAccount.uuid,
    name: 'ExistingBlock',
    payload: { derp: 'flerp' },
};
afterEach(() => {
    mockedDataStore.get.mockReset();
    jest.clearAllMocks();
});
describe('When creating a block', () => {
    it('returns successful create message', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)));
        mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]));
        const _response = yield block_1.default.create(_accountUUID, 'NewBlock', { derp: 'flerp' });
        expect(_response).toMatch(/Your Pantry was updated with basket: NewBlock/);
    }));
    it('allows for empty payload', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)));
        mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]));
        const _response = yield block_1.default.create(_accountUUID, 'NewBlock', {});
        expect(_response).toMatch(/Your Pantry was updated with basket: NewBlock/);
    }));
    it('throws an error if validation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)));
        mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]));
        yield expect(block_1.default.create(_accountUUID, 'NewBlock', 'string'))
            .rejects
            .toThrow('Validation failed:');
    }));
    it('throws an error if account has reached max # of blocks', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        const _maxedAccount = {
            name: 'Maxed Existing Account',
            description: 'Account made while testing',
            contactEmail: 'derp@flerp.com',
            maxNumberOfBlocks: 1,
            notifications: true,
            errors: [],
            uuid: '6dc70531-d0bf-4b3a-8265-b20f8a69e180',
        };
        mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_maxedAccount)));
        mockedDataStore.find.mockReturnValueOnce(Promise.resolve(['oldBlock']));
        yield expect(block_1.default.create(_accountUUID, 'NewBlock', { derp: 'flerp' }))
            .rejects
            .toThrow('max number of baskets reached');
    }));
});
describe('When updating a block', () => {
    const _newBlockData = { newKey: 'newValue' };
    it('successfully updates payload of block', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        mockedDataStore.get
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)));
        const _response = yield block_1.default.update(_accountUUID, 'ExistingBlock', _newBlockData);
        expect(_response).toEqual({ derp: 'flerp', newKey: 'newValue' });
    }));
    it('throws an error if block does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        const _blockName = 'ExistingBlock';
        mockedDataStore.get
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
            .mockReturnValueOnce(Promise.resolve(null));
        yield expect(block_1.default.update(_accountUUID, _blockName, _newBlockData))
            .rejects
            .toThrow(`${_blockName} does not exist`);
    }));
});
describe('When retrieving a block', () => {
    it('successfully returns payload of block', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        mockedDataStore.get
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)));
        const _payload = yield block_1.default.get(_accountUUID, 'NewBlock');
        expect(_payload).toEqual({ derp: 'flerp' });
    }));
    it('throws an error if block does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        const _blockName = 'NewBlock';
        mockedDataStore.get
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
            .mockReturnValueOnce(Promise.resolve(null));
        yield expect(block_1.default.get(_accountUUID, _blockName))
            .rejects
            .toThrow(`${_blockName} does not exist`);
    }));
});
describe('When deleting a block', () => {
    it('returns confirmation message', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        mockedDataStore.get
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)));
        const _payload = yield block_1.default.delete(_accountUUID, 'NewBlock');
        expect(_payload).toMatch(/NewBlock was removed from your Pantry/);
    }));
    it('throws an error if block does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        const _blockName = 'NewBlock';
        mockedDataStore.get
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
            .mockReturnValueOnce(Promise.resolve(null));
        yield expect(block_1.default.delete(_accountUUID, _blockName))
            .rejects
            .toThrow(`${_blockName} does not exist`);
    }));
});
describe('When throwing a block error', () => {
    it('does not email the user if error count is not divisable by 5', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        const _blockName = 'ExistingBlock';
        const _existingErrors = ['error #1'];
        const _existingAccountWithErrors = Object.assign(Object.assign({}, _existingAccount), { errors: _existingErrors });
        const _spy = jest.spyOn(mailer, 'sendAccountErrorsEmail');
        mockedDataStore.get
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccountWithErrors)))
            .mockReturnValueOnce(Promise.resolve(null));
        try {
            yield block_1.default.get(_accountUUID, _blockName);
        }
        catch (_a) {
            expect(_spy).not.toHaveBeenCalled();
        }
        _spy.mockRestore();
    }));
    it('emails the user if error count reaches threshold', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        const _blockName = 'ExistingBlock';
        const _newError = `${_blockName} does not exist`;
        const _existingErrors = [
            'error #1',
            'error #2',
            'error #3',
            'error #4',
        ];
        const _existingAccountWithErrors = Object.assign(Object.assign({}, _existingAccount), { errors: _existingErrors });
        const _spy = jest.spyOn(mailer, 'sendAccountErrorsEmail');
        mockedDataStore.get
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccountWithErrors)))
            .mockReturnValueOnce(Promise.resolve(null));
        try {
            yield block_1.default.get(_accountUUID, _blockName);
        }
        catch (_b) {
            expect(_spy).toHaveBeenCalledTimes(1);
            expect(_spy)
                .toHaveBeenCalledWith(_newError, _existingAccount.contactEmail, _accountUUID);
        }
        _spy.mockRestore();
    }));
    it('does not email the user if error count reaches threshold and notifications is false', () => __awaiter(void 0, void 0, void 0, function* () {
        const _accountUUID = '6dc70531-d0bf-4b3a-8265-b20f8a69e180';
        const _blockName = 'ExistingBlock';
        const _existingErrors = [
            'error #1',
            'error #2',
            'error #3',
            'error #4',
        ];
        const _existingAccountWithErrorsAndNotificationsFalse = Object.assign(Object.assign({}, _existingAccount), { errors: _existingErrors, notifications: false });
        const _spy = jest.spyOn(mailer, 'sendAccountErrorsEmail');
        mockedDataStore.get
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccountWithErrorsAndNotificationsFalse)))
            .mockReturnValueOnce(Promise.resolve(null));
        try {
            yield block_1.default.get(_accountUUID, _blockName);
        }
        catch (_c) {
            expect(_spy).not.toHaveBeenCalled();
        }
        _spy.mockRestore();
    }));
});
