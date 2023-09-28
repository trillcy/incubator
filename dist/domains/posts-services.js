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
exports.postsService = void 0;
const postsDb_1 = require("../db/postsDb");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
exports.postsService = {
    findAll(
    // searchNameTerm: string | undefined,
    sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.findAll(
            // searchNameTerm,
            sortBy, sortDirection, pageNumber, pageSize);
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.findById(id);
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.deleteAll();
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.delete(id);
        });
    },
    update(id, title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogModel = yield blogs_db_repository_1.blogsRepository.findById(blogId);
            if (!blogModel) {
                return false;
            }
            return yield posts_db_repository_1.postsRepository.update(id, title, shortDescription, content, blogId);
        });
    },
    create(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogModel = yield blogs_db_repository_1.blogsRepository.findById(blogId);
            if (!blogModel)
                return null;
            const blogName = blogModel.name;
            const date = new Date();
            const id = `${postsDb_1.postsDb.length}-${date.toISOString()}`;
            const newElement = {
                id,
                title,
                shortDescription,
                content,
                blogId,
                blogName,
                createdAt: date.toISOString(),
            };
            console.log('60+++post.serv', newElement);
            const result = yield posts_db_repository_1.postsRepository.create(Object.assign({}, newElement));
            if (result) {
                return newElement;
            }
            else {
                return null;
            }
        });
    },
};
