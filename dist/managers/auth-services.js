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
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongodb_1 = require("mongodb");
const users_db_repository_1 = require("../repositories/users-db-repository");
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns");
exports.authService = {
    sendRegistraitonEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('13====auth.serv');
            // сохраняем пользователя в БД
            return true;
        });
    },
    checkCredential(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.usersRepository.findUserByLoginOrEmail(loginOrEmail);
            if (!user)
                return null;
            const passwordHash = yield bcrypt_1.default.hash(password, user.passwordSalt);
            if (user.passwordHash !== passwordHash)
                return null;
            return user;
        });
    },
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield bcrypt_1.default.hash(password, passwordSalt);
            const date = new Date();
            const newElement = {
                _id: new mongodb_1.ObjectId(),
                accountData: {
                    userName: { login, email },
                    passwordHash,
                    createdAt: date,
                },
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, date_fns_1.add)(date, { hours: 1, minutes: 3 }),
                    isConfirmed: false,
                },
            };
            // const result = await usersRepository.create(newElement)
            return result;
        });
    },
};
