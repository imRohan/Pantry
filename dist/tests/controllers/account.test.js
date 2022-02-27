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
const account_1 = require("../../src/controllers/account");
const crm = require("../../src/services/crm");
const dataStore = require("../../src/services/dataStore");
const mailer = require("../../src/services/mailer");
const recaptcha = require("../../src/services/recaptcha");
jest.mock('../../src/services/dataStore');
jest.mock('../../src/services/mailer');
jest.mock('../../src/services/crm');
jest.mock('../../src/services/recaptcha');
const mockedDataStore = dataStore;
const mockedRecaptcha = recaptcha;
// Constants
const _newAccountParams = {
    name: 'New Account',
    description: 'Account made while testing',
    contactEmail: 'derp@flerp.com',
    recaptchaResponse: 'derp',
};
const _updatedAccountParams = {
    name: 'Updated Account',
    description: 'Account update made while testing',
    notifications: false,
};
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
describe('When creating an account', () => {
    it('returns the account uuid', () => __awaiter(void 0, void 0, void 0, function* () {
        const _uuid = yield account_1.default.create(_newAccountParams);
        expect(_uuid).toBeDefined();
    }));
    it('sends a welcome email', () => __awaiter(void 0, void 0, void 0, function* () {
        const _spy = jest.spyOn(mailer, 'sendWelcomeEmail');
        const _uuid = yield account_1.default.create(_newAccountParams);
        expect(_spy).toHaveBeenCalled();
        expect(_spy).toHaveBeenCalledWith(_newAccountParams.contactEmail, _uuid);
        _spy.mockRestore();
    }));
    it('stores user details in crm platform', () => __awaiter(void 0, void 0, void 0, function* () {
        const _spy = jest.spyOn(crm, 'addNewUser');
        const _uuid = yield account_1.default.create(_newAccountParams);
        expect(_spy).toHaveBeenCalled();
        expect(_spy).toHaveBeenCalledWith(_newAccountParams.contactEmail, _uuid);
        _spy.mockRestore();
    }));
    it('throws an error if validations fail', () => __awaiter(void 0, void 0, void 0, function* () {
        const _invalidAccountParams = {
            description: 'Account made while testing',
            contactEmail: 'derp@flerp.com',
        };
        yield expect(account_1.default.create(_invalidAccountParams))
            .rejects
            .toThrow('Validation failed:');
    }));
    it('attempts to verify the recaptcha', () => __awaiter(void 0, void 0, void 0, function* () {
        const _spy = jest.spyOn(recaptcha, 'verify');
        yield account_1.default.create(_newAccountParams);
        expect(_spy).toHaveBeenCalled();
        expect(_spy).toHaveBeenCalledWith(_newAccountParams.recaptchaResponse);
        _spy.mockRestore();
    }));
    describe('When the recaptcha fails', () => {
        it('throws an error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockedRecaptcha.verify.mockReturnValueOnce(Promise.resolve(false));
            yield expect(account_1.default.create(_newAccountParams))
                .rejects
                .toThrow('ReCaptcha Failed');
        }));
    });
});
describe('When updating an account', () => {
    it('returns the updated account attributes', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)));
        mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]));
        const _accountBase = yield account_1.default.update(_existingAccount.uuid, _updatedAccountParams);
        const { name, description, notifications } = _accountBase;
        expect(_accountBase).toBeDefined();
        expect(name).toBe('Updated Account');
        expect(description).toBe('Account update made while testing');
        expect(notifications).toBe(false);
    }));
    it('throws an error if validations fail', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)));
        const _invalidAccountUpdateParams = {
            notifications: 'not a boolean',
        };
        yield expect(account_1.default.update(_existingAccount.uuid, _invalidAccountUpdateParams))
            .rejects
            .toThrow('Validation failed:');
    }));
});
describe('When retrieving an account', () => {
    it('returns the correct account attributes', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)));
        mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]));
        const _accountBase = yield account_1.default.get(_existingAccount.uuid);
        expect(_accountBase).toBeDefined();
    }));
    it('throws an error if account does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedDataStore.get.mockReturnValueOnce(Promise.resolve(null));
        yield expect(account_1.default.get(_existingAccount.uuid))
            .rejects
            .toThrow(`pantry with id: ${_existingAccount.uuid} not found`);
    }));
});
describe('When deleting an account', () => {
    it('returns confirmation message', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedDataStore.get.mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)));
        mockedDataStore.find.mockReturnValueOnce(Promise.resolve([]));
        const _response = yield account_1.default.delete(_existingAccount.uuid);
        expect(_response).toMatch(/Your Pantry has been deleted/);
    }));
    it('deletes all existing blocks', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedDataStore.get
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingAccount)))
            .mockReturnValueOnce(Promise.resolve(JSON.stringify(_existingBlock)));
        mockedDataStore.find.mockReturnValueOnce(Promise.resolve([`account:${_existingAccount.uuid}::block:${_existingBlock.name}`]));
        const _response = yield account_1.default.delete(_existingAccount.uuid);
        expect(_response).toMatch(/Your Pantry has been deleted/);
    }));
    it('throws an error if account does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedDataStore.get.mockReturnValueOnce(Promise.resolve(null));
        yield expect(account_1.default.delete(_existingAccount.uuid))
            .rejects
            .toThrow(`pantry with id: ${_existingAccount.uuid} not found`);
    }));
});
