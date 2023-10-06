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
exports.usersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
const users_db_repository_1 = require("../repositories/users-db-repository");
exports.usersService = {
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.usersRepository.findById(id);
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // const transformId = id.
            return yield users_db_repository_1.usersRepository.delete(id);
        });
    },
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const date = new Date();
            const newElement = {
                _id: new mongodb_1.ObjectId(),
                accountData: {
                    userName: { login, email },
                    passwordHash,
                    passwordSalt,
                    createdAt: date,
                },
                emailConfirmation: {
                    confirmationCode: null,
                    expirationDate: null,
                    isConfirmed: false,
                },
            };
            console.log('37===users', newElement);
            const result = yield users_db_repository_1.usersRepository.create(Object.assign({}, newElement));
            return result;
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.hash(password, salt);
        });
    },
};
