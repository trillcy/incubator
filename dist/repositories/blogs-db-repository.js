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
const db_1 = require("../db/db");
const mongodb_1 = require("mongodb");
const blogsFields = [
    'id',
    'name',
    'description',
    'websiteUrl',
    'createdAt',
    'isMembership',
];
const blogsDirections = ['asc', 'desc'];
exports.blogsRepository = {
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.blogsCollection.deleteMany({});
            const totalCount = yield db_1.blogsCollection.countDocuments({});
            return totalCount === 0;
        });
    },
    findAll(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            // Promise<BlogType[] | undefined> {
            const searchName = searchNameTerm ? searchNameTerm : '';
            // -----
            const sortField = sortBy && blogsFields.includes(sortBy) ? sortBy : 'createdAt';
            const sortString = sortDirection && blogsDirections.includes(sortDirection)
                ? sortDirection
                : 'desc';
            const sortValue = sortString === 'desc' ? -1 : 1;
            const sortObject = {};
            sortObject[sortField] = sortValue;
            // ------
            // TODO: проверить общее количество элементов в коллекции
            // если меньше, то поставить соответствующий skipElements
            // ------
            const numberOfPage = pageNumber && Number.isInteger(+pageNumber) ? +pageNumber : 1;
            const size = pageSize && Number.isInteger(+pageSize) ? +pageSize : 10;
            const skipElements = (numberOfPage - 1) * size;
            const items = yield db_1.blogsCollection
                .find({ name: { $regex: searchName, $options: 'i' } })
                .sort(sortObject)
                .skip(skipElements)
                .limit(size)
                .toArray();
            const totalCount = yield db_1.blogsCollection.countDocuments({
                name: { $regex: searchName, $options: 'i' },
            });
            const pagesCount = Math.ceil(totalCount / size);
            const resultArray = [];
            const result = items.map((el) => {
                return {
                    id: el._id.toString(),
                    name: el.name,
                    description: el.description,
                    websiteUrl: el.websiteUrl,
                    createdAt: el.createdAt,
                    isMembership: el.isMembership,
                };
            });
            return {
                pagesCount,
                page: numberOfPage,
                pageSize: size,
                totalCount,
                items: result,
            };
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (result) {
                return {
                    id: result._id.toString(),
                    name: result.name,
                    description: result.description,
                    websiteUrl: result.websiteUrl,
                    createdAt: result.createdAt,
                    isMembership: result.isMembership,
                };
            }
            else {
                return null;
            }
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount === 1;
        });
    },
    update(id, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
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
    create(newElement) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.blogsCollection.insertOne(Object.assign({}, newElement));
            if (result.acknowledged) {
                return {
                    id: result.insertedId.toString(),
                    name: newElement.name,
                    description: newElement.description,
                    websiteUrl: newElement.websiteUrl,
                    createdAt: newElement.createdAt,
                    isMembership: newElement.isMembership,
                };
            }
            else {
                return null;
            }
        });
    },
};
