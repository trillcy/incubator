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
const db_1 = require("../db/db");
const blogs_db_repository_1 = require("./blogs-db-repository");
const postsFields = [
    'id',
    'title',
    'shortDescription',
    'content',
    'blogId',
    'blogName',
];
const postsDirections = ['asc', 'desc'];
exports.postsRepository = {
    findAll(sortBy, sortDirection, pageNumber, pageSize, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            // -----
            const sortField = sortBy && postsFields.includes(sortBy) ? sortBy : 'createdAt';
            const sortString = sortDirection && postsDirections.includes(sortDirection)
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
            const searchObject = blogId ? { blogId: blogId } : {};
            // ---------
            const items = yield db_1.postsCollection
                .find(searchObject, { projection: { _id: 0 } })
                .sort(sortObject)
                .skip(skipElements)
                .limit(size)
                .toArray();
            const totalCount = yield db_1.postsCollection.countDocuments(searchObject);
            const pagesCount = Math.ceil(totalCount / size);
            const resultArray = [];
            if (items.length) {
                for (let item of items) {
                    const blogModel = yield blogs_db_repository_1.blogsRepository.findById(item.blogId);
                    if (blogModel) {
                        const object = {
                            id: item.id,
                            title: item.title,
                            shortDescription: item.shortDescription,
                            content: item.content,
                            blogId: item.blogId,
                            blogName: blogModel.name,
                            createdAt: item.createdAt,
                        };
                        resultArray.push(object);
                    }
                    else {
                        return null;
                    }
                }
                const result = {
                    pagesCount,
                    page: numberOfPage,
                    pageSize: size,
                    totalCount,
                    items: resultArray,
                };
                return result;
            }
            else {
                return null;
            }
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.findOne({ id: id }, { projection: { _id: 0 } });
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
            const result = yield db_1.postsCollection.deleteMany({});
            const totalCount = yield db_1.postsCollection.countDocuments({});
            return totalCount === 0;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.deleteOne({ id: id });
            return result.deletedCount === 1;
        });
    },
    update(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.postsCollection.updateOne({ id: id }, {
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
    create(newElement) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.postsCollection.insertOne(Object.assign({}, newElement));
            return newElement;
        });
    },
};
