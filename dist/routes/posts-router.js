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
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const express_validator_1 = require("express-validator");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
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
const postsRouter = () => {
    const router = (0, express_1.Router)();
    /*
    const idValidation = param('id')
      .isString()
      .trim()
      .notEmpty()
      .exists({ checkFalsy: true })
  
    const titleValidation = body('title')
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 1, max: 30 })
  
    const shortDescriptionValidation = body('shortDescription')
      .isString()
      .isLength({ min: 1, max: 100 })
  
    const contentValidation = body('content')
      .isString()
      .trim()
      .notEmpty()
  
      .isLength({ min: 1, max: 1000 })
  
    const blogIdValidation = body('blogId')
      .isString()
      .trim()
      .notEmpty()
      .exists({ checkFalsy: true })
      .custom(async (value) => {
        const blog = await blogsRepository.findById(value)
        if (!blog) throw new Error('incorrect blogId')
        return true
      })
  */
    const auth = (basicString) => {
        return basicString === `Basic YWRtaW46cXdlcnR5` ? true : false;
    };
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = req.query;
        const result = yield posts_db_repository_1.postsRepository.findAll(
        // searchNameTerm?.toString(),
        sortBy === null || sortBy === void 0 ? void 0 : sortBy.toString(), sortDirection === null || sortDirection === void 0 ? void 0 : sortDirection.toString(), pageNumber === null || pageNumber === void 0 ? void 0 : pageNumber.toString(), pageSize === null || pageSize === void 0 ? void 0 : pageSize.toString());
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.sendStatus(404);
        }
    }));
    router.get('/:id', 
    //validationMiidleware.idValidation,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = req.params.id;
        const post = yield posts_db_repository_1.postsRepository.findById(postId);
        // добавляем blogName
        if (post) {
            const blogId = post.blogId;
            const blogModel = yield blogs_db_repository_1.blogsRepository.findById(blogId);
            if (blogModel) {
                const blogName = blogModel.name;
                res.status(200).json(Object.assign(Object.assign({}, post), { blogName }));
            }
            else {
                res.sendStatus(443);
            }
        }
        else {
            res.sendStatus(404);
        }
    }));
    router.post('/', validation_1.validationMiidleware.titleValidation, validation_1.validationMiidleware.shortDescriptionValidation, validation_1.validationMiidleware.contentValidation, validation_1.validationMiidleware.blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const { title, shortDescription, content, blogId } = req.body;
            const newPost = yield posts_services_1.postsService.create(title, shortDescription, content, blogId);
            // добавляем blogName
            if (newPost) {
                res.status(201).json(newPost);
            }
            else {
                res.sendStatus(444);
            }
        }
    }));
    router.put('/:id', validation_1.validationMiidleware.idValidation, validation_1.validationMiidleware.titleValidation, validation_1.validationMiidleware.shortDescriptionValidation, validation_1.validationMiidleware.contentValidation, validation_1.validationMiidleware.blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const { title, shortDescription, content, blogId } = req.body;
            const result = yield posts_db_repository_1.postsRepository.update(id, title, shortDescription, content, blogId);
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
        const result = yield posts_db_repository_1.postsRepository.delete(id);
        if (result) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(404);
        }
    }));
    return router;
};
exports.postsRouter = postsRouter;
