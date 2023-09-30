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
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const express_validator_1 = require("express-validator");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const blogs_services_1 = require("../domains/blogs-services");
const validation_1 = require("../middlewares/validation");
const posts_services_1 = require("../domains/posts-services");
const ErrorFormatter = (error) => {
    switch (error.type) {
        case 'field':
            return {
                message: error.msg,
                field: error.path,
            };
        default:
            return {
                message: error.msg,
                field: 'None',
            };
    }
};
const blogsRouter = () => {
    const router = (0, express_1.Router)();
    const auth = (basicString) => {
        return basicString === `Basic YWRtaW46cXdlcnR5` ? true : false;
    };
    router.post('/', validation_1.validationMiidleware.nameValidation, validation_1.validationMiidleware.descriptionValidation, validation_1.validationMiidleware.websiteUrlValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const checkAuth = auth(req.headers.authorization);
        if (!checkAuth) {
            res.sendStatus(401);
            return;
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            res.status(400).send({ errorsMessages });
        }
        else {
            const { name, description, websiteUrl } = req.body;
            const newBlog = yield blogs_services_1.blogsService.create(name, description, websiteUrl);
            res.status(201).json(newBlog);
            //===.send()
        }
    }));
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = req.query;
        const result = yield blogs_db_repository_1.blogsRepository.findAll(searchNameTerm === null || searchNameTerm === void 0 ? void 0 : searchNameTerm.toString(), sortBy === null || sortBy === void 0 ? void 0 : sortBy.toString(), sortDirection === null || sortDirection === void 0 ? void 0 : sortDirection.toString(), pageNumber === null || pageNumber === void 0 ? void 0 : pageNumber.toString(), pageSize === null || pageSize === void 0 ? void 0 : pageSize.toString());
        res.status(200).json(result);
    }));
    router.get('/:id', 
    // validationMiidleware.idValidation,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const resId = req.params.id;
        const result = yield blogs_db_repository_1.blogsRepository.findById(resId);
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.sendStatus(404);
        }
    }));
    router.put('/:id', validation_1.validationMiidleware.idValidation, validation_1.validationMiidleware.nameValidation, validation_1.validationMiidleware.descriptionValidation, validation_1.validationMiidleware.websiteUrlValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const checkAuth = auth(req.headers.authorization);
        if (!checkAuth) {
            res.sendStatus(401);
            return;
        }
        const id = req.params.id;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            res.status(400).send({ errorsMessages });
        }
        else {
            const { name, description, websiteUrl } = req.body;
            const result = yield blogs_db_repository_1.blogsRepository.update(id, name, description, websiteUrl);
            if (result) {
                res.sendStatus(204);
                return;
            }
            else {
                res.sendStatus(404);
            }
        }
    }));
    router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const checkAuth = auth(req.headers.authorization);
        if (!checkAuth) {
            res.sendStatus(401);
            return;
        }
        const id = req.params.id;
        const result = yield blogs_db_repository_1.blogsRepository.delete(id);
        if (result) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(404);
        }
    }));
    router.post('/:blogId/posts', validation_1.validationMiidleware.titleValidation, validation_1.validationMiidleware.shortDescriptionValidation, validation_1.validationMiidleware.contentValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const checkAuth = auth(req.headers.authorization);
        if (!checkAuth) {
            res.sendStatus(401);
            return;
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            return res.status(400).send({ errorsMessages });
        }
        else {
            const { title, shortDescription, content } = req.body;
            const blogId = req.params.blogId;
            if (!blogId) {
                res.sendStatus(404);
                return;
            }
            const newPost = yield posts_services_1.postsService.create(title, shortDescription, content, blogId);
            if (newPost) {
                return res.status(201).json(newPost);
            }
            else {
                return res.sendStatus(404);
            }
        }
    }));
    router.get('/:blogId/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blogId = req.params.blogId;
        if (!blogId) {
            res.sendStatus(404);
            return;
        }
        const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
        const result = yield posts_db_repository_1.postsRepository.findAll(sortBy === null || sortBy === void 0 ? void 0 : sortBy.toString(), sortDirection === null || sortDirection === void 0 ? void 0 : sortDirection.toString(), pageNumber === null || pageNumber === void 0 ? void 0 : pageNumber.toString(), pageSize === null || pageSize === void 0 ? void 0 : pageSize.toString(), blogId);
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.sendStatus(404);
        }
    }));
    return router;
};
exports.blogsRouter = blogsRouter;
