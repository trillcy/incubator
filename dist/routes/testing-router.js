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
exports.testingRouter = void 0;
const express_1 = require("express");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const users_db_repository_1 = require("../repositories/users-db-repository");
const testingRouter = () => {
    const router = (0, express_1.Router)();
    router.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const resultPosts = yield posts_db_repository_1.postsRepository.deleteAll();
        const resultBlogs = yield blogs_db_repository_1.blogsRepository.deleteAll();
        const resultUsers = yield users_db_repository_1.usersRepository.deleteAll();
        console.log('12===', resultPosts);
        res.sendStatus(204);
    }));
    return router;
};
exports.testingRouter = testingRouter;
