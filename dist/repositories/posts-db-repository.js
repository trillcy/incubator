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
exports.postsRepository = void 0;
const postsDb_1 = require("../db/postsDb");
const db_1 = require("../db/db");
exports.postsRepository = {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('6++++');
            const result = yield db_1.postsCoollection
                .find({}, { projection: { _id: 0 } })
                .toArray();
            console.log('9+++post-rep', result);
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
            const result = yield db_1.postsCoollection.findOne({ id: id }, { projection: { _id: 0 } });
            if (result) {
                return result;
            }
            else {
                return null;
            }
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCoollection.deleteMany({});
            const totalCount = yield db_1.postsCoollection.countDocuments({});
            return totalCount === 0;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCoollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    update(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCoollection.updateOne({ id: id }, {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blogId,
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
    create(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('60+++post-repo');
            // const blog = await blogsCoollection.findOne(
            //   { id: blogId },
            //   { projection: { _id: 0 } }
            // )
            const date = new Date();
            const id = `${postsDb_1.postsDb.length}-${date.toISOString()}`;
            const newElement = {
                id,
                title,
                shortDescription,
                content,
                blogId,
                // blogName: blog!.name,
                createdAt: date.toISOString(),
            };
            const result = yield db_1.db
                .collection('posts')
                .insertOne(Object.assign({}, newElement));
            return newElement;
            // }
        });
    },
};
