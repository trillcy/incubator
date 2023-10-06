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
exports.usersRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../db/db");
const usersFields = [
    'id',
    'login',
    'email',
    'passwordHash',
    'passwordSalt',
    'createdAt',
];
const usersDirections = ['asc', 'desc'];
exports.usersRepository = {
    findByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.findOne({
                'emailConfirmation.confirmationCode': code,
            });
            console.log('28+++users', result);
            if (result) {
                return {
                    id: result._id.toString(),
                    accountData: {
                        userName: {
                            login: result.accountData.userName.login,
                            email: result.accountData.userName.email,
                        },
                        passwordHash: result.accountData.passwordHash,
                        createdAt: result.accountData.createdAt,
                    },
                    emailConfirmation: {
                        confirmationCode: result.emailConfirmation.confirmationCode,
                        expirationDate: result.emailConfirmation.expirationDate,
                        isConfirmed: result.emailConfirmation.isConfirmed,
                    },
                };
            }
            else {
                return null;
            }
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.findOne({ _id: id }
            // { projection: { _id: 0 } }
            );
            if (result) {
                return {
                    id: result._id.toString(),
                    login: result.accountData.userName.login,
                    email: result.accountData.userName.email,
                    createdAt: result.accountData.createdAt.toISOString(),
                };
            }
            else {
                return null;
            }
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersCollection.deleteMany({});
            const totalCount = yield db_1.usersCollection.countDocuments({});
            return totalCount === 0;
        });
    },
    findAllUsers(searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchLogin = searchLoginTerm ? searchLoginTerm : '';
            const searchEmail = searchEmailTerm ? searchEmailTerm : '';
            // -----
            const sortField = sortBy && usersFields.includes(sortBy) ? sortBy : 'createdAt';
            const sortString = sortDirection && usersDirections.includes(sortDirection)
                ? sortDirection
                : 'desc';
            const sortValue = sortString === 'desc' ? -1 : 1;
            const sortObject = {};
            sortObject[sortField] = sortValue;
            const numberOfPage = pageNumber && Number.isInteger(+pageNumber) ? +pageNumber : 1;
            const size = pageSize && Number.isInteger(+pageSize) ? +pageSize : 10;
            const skipElements = (numberOfPage - 1) * size;
            const items = yield db_1.usersCollection
                .find({
                $or: [
                    {
                        login: { $regex: searchLogin, $options: 'i' },
                    },
                    { email: { $regex: searchEmail, $options: 'i' } },
                ],
            }
            // { projection: { _id: 0 } }
            )
                .sort(sortObject)
                .skip(skipElements)
                .limit(size)
                .toArray();
            const totalCount = yield db_1.usersCollection.countDocuments({
                $or: [
                    {
                        login: { $regex: searchLogin, $options: 'i' },
                    },
                    { email: { $regex: searchEmail, $options: 'i' } },
                ],
            });
            const pagesCount = Math.ceil(totalCount / size);
            return {
                pagesCount,
                page: numberOfPage,
                pageSize: size,
                totalCount,
                items: items.map((i) => ({
                    id: i._id.toString(),
                    login: i.accountData.userName.login,
                    email: i.accountData.userName.email,
                    createdAt: i.accountData.createdAt.toISOString(),
                })),
            };
        });
    },
    findByLogin(login) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.findOne({ 'accountData.userName.login': login }
            // { projection: { _id: 0 } }
            );
            if (result) {
                return {
                    id: result._id.toString(),
                    login: result.accountData.userName.login,
                    email: result.accountData.userName.email,
                    createdAt: result.accountData.createdAt.toISOString(),
                };
            }
            else {
                return null;
            }
        });
    },
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.findOne({
                'accountData.userName.email': email,
            });
            if (result) {
                return {
                    id: result._id.toString(),
                    login: result.accountData.userName.login,
                    email: result.accountData.userName.email,
                    createdAt: result.accountData.createdAt.toISOString(),
                    confirmationCode: result.emailConfirmation.confirmationCode,
                    expirationDate: result.emailConfirmation.expirationDate,
                    isConfirmed: result.emailConfirmation.isConfirmed,
                };
            }
            else {
                return null;
            }
        });
    },
    findUserByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersCollection.findOne({
                $or: [
                    { 'accountData.userName.login': loginOrEmail },
                    { 'accountData.userName.email': loginOrEmail },
                ],
            });
            return result;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                return result.deletedCount === 1;
            }
            catch (e) {
                return null;
            }
        });
    },
    create(newElement) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield db_1.usersCollection.insertOne(Object.assign({}, newElement));
            if (created.acknowledged) {
                return {
                    id: created.insertedId.toString(),
                    login: newElement.accountData.userName.login,
                    email: newElement.accountData.userName.email,
                    createdAt: newElement.accountData.createdAt.toISOString(),
                };
            }
            else {
                return null;
            }
        });
    },
    updateUser(id, newElement) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield db_1.usersCollection.updateOne({ _id: id }, { $set: newElement });
            return updated.acknowledged;
        });
    },
};
