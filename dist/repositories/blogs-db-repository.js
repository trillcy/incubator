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
exports.blogsRepository = void 0;
const blogsDb_1 = require("../db/blogsDb");
const db_1 = require("../db/db");
exports.blogsRepository = {
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.blogsCoollection.deleteMany({});
            const totalCount = yield db_1.blogsCoollection.countDocuments({});
            return totalCount === 0;
        });
    },
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCoollection
                .find({}, { projection: { _id: 0 } })
                .toArray();
            if (result) {
                return result;
            }
            else {
                return undefined;
            }
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.blogsCoollection.findOne({ id: id }, { projection: { _id: 0 } });
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCoollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    update(id, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCoollection.updateOne({ id: id }, {
                $set: {
                    name: name,
                    description: description,
                    websiteUrl: websiteUrl,
                },
            });
            if (result.matchedCount === 1) {
                return true;
            }
            else {
                return false;
            }
        });
    },
    create(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const id = `${blogsDb_1.blogsDb.length}-${date.toISOString()}`;
            const newElement = {
                id: id,
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: date.toISOString(),
                isMembership: false,
            };
            yield db_1.blogsCoollection.insertOne(Object.assign({}, newElement));
            return newElement;
        });
    },
};
