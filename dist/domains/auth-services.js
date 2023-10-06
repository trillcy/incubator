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
const emails_managers_1 = require("../managers/emails-managers");
exports.authService = {
    confirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            // находим пользователя по code
            const user = yield users_db_repository_1.usersRepository.findByCode(code);
            console.log('15===auth', user);
            if (user) {
                const newElement = {
                    emailConfirmation: {
                        confirmationCode: user.emailConfirmation.confirmationCode,
                        expirationDate: user.emailConfirmation.expirationDate,
                        isConfirmed: true,
                    },
                };
                return yield users_db_repository_1.usersRepository.updateUser(new mongodb_1.ObjectId(user.id), newElement);
            }
            return false;
        });
    },
    sendRegistraitonEmail(userId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('25====auth.serv', userId);
            const updatedObject = {
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, date_fns_1.add)(new Date(), { hours: 1, minutes: 3 }),
                    isConfirmed: false,
                },
            };
            const updatedUser = yield users_db_repository_1.usersRepository.updateUser(new mongodb_1.ObjectId(userId), updatedObject);
            console.log('48====auth', updatedUser);
            if (!updatedUser) {
                return null;
            }
            const url = `https://somesite.com/confirm-registration?code=${updatedObject.emailConfirmation.confirmationCode}`;
            const emailObject = {
                // const email: user.email,
                email: email,
                message: `<h1>Thank for your registration</h1>
<p>To finish registration please follow the link below:
<a href=${url}>complete registration</a>
</p>`,
                subject: `Confirmation of registration`,
            };
            console.log('41=====auth', emailObject);
            return yield emails_managers_1.emailManager.sendEmailConfirmationMessage(emailObject);
        });
    },
    checkCredential(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.usersRepository.findUserByLoginOrEmail(loginOrEmail);
            if (!user)
                return null;
            const passwordHash = yield bcrypt_1.default.hash(password, user.accountData.passwordSalt);
            if (user.accountData.passwordHash !== passwordHash)
                return null;
            return user;
        });
    },
    emailResending(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.usersRepository.findByEmail(email);
            if (!user) {
                return null;
            }
            console.log('96====auth', user.id, email);
            return yield this.sendRegistraitonEmail(user.id, email);
        });
    },
    registration(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield bcrypt_1.default.hash(password, passwordSalt);
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
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, date_fns_1.add)(date, { hours: 1, minutes: 3 }),
                    isConfirmed: false,
                },
            };
            const user = yield users_db_repository_1.usersRepository.create(newElement);
            if (!user) {
                return null;
            }
            return yield this.sendRegistraitonEmail(user.id, user.email);
        });
    },
};
