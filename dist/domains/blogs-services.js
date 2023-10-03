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
exports.blogsService = void 0;
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const mongodb_1 = require("mongodb");
exports.blogsService = {
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogsRepository.delete(id);
        });
    },
    update(id, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogs_db_repository_1.blogsRepository.update(id, name, description, websiteUrl);
        });
    },
    create(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            // const id = `${Math.floor(Math.random() * 30)}-${date.toISOString()}`
            const newElement = {
                _id: new mongodb_1.ObjectId(),
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: date.toISOString(),
                isMembership: false,
            };
            const result = yield blogs_db_repository_1.blogsRepository.create(newElement);
            return result;
        });
    },
};
