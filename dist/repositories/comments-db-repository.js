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
exports.commentsRepository = void 0;
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const commentsFields = [
    'id',
    'commentatorInfo.userLogin',
    'commentatorInfo.userId',
    'content',
    'postId',
];
const directions = ['asc', 'desc'];
exports.commentsRepository = {
    findAllComments(sortBy, sortDirection, pageNumber, pageSize, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            // -----
            const sortField = sortBy && commentsFields.includes(sortBy) ? sortBy : 'createdAt';
            const sortString = sortDirection && directions.includes(sortDirection)
                ? sortDirection
                : 'desc';
            const sortValue = sortString === 'desc' ? -1 : 1;
            const sortObject = {};
            sortObject[sortField] = sortValue;
            // ------
            const numberOfPage = pageNumber && Number.isInteger(+pageNumber) ? +pageNumber : 1;
            const size = pageSize && Number.isInteger(+pageSize) ? +pageSize : 10;
            const skipElements = (numberOfPage - 1) * size;
            // -----
            const searchObject = postId ? { postId: postId } : {};
            // ---------
            const items = yield db_1.commentsCollection
                .find(searchObject) //, { projection: { _id: 0 } }
                .sort(sortObject)
                .skip(skipElements)
                .limit(size)
                .toArray();
            const totalCount = yield db_1.commentsCollection.countDocuments(searchObject);
            const pagesCount = Math.ceil(totalCount / size);
            const resultArray = [];
            // if (items.length) {
            for (let item of items) {
                const object = {
                    id: item._id.toString(),
                    content: item.content,
                    commentatorInfo: {
                        userId: item.commentatorInfo.userId,
                        userLogin: item.commentatorInfo.userLogin,
                    },
                    createdAt: item.createdAt,
                };
                resultArray.push(object);
            }
            const result = {
                pagesCount,
                page: numberOfPage,
                pageSize: size,
                totalCount,
                items: resultArray,
            };
            return result;
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (result) {
                return {
                    id: result._id.toString(),
                    content: result.content,
                    commentatorInfo: {
                        userLogin: result.commentatorInfo.userLogin,
                        userId: result.commentatorInfo.userId,
                    },
                    createdAt: result.createdAt,
                };
                // =====
            }
            else {
                return null;
            }
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.deleteMany({});
            const totalCount = yield db_1.commentsCollection.countDocuments({});
            return totalCount === 0;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            console.log('109++++comments.repo', id);
            console.log('110++++comments.repo', result);
            return result.deletedCount === 1;
        });
    },
    update(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    content: content,
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
    createComment(newElement) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.commentsCollection.insertOne(Object.assign({}, newElement));
            return newElement;
        });
    },
};
