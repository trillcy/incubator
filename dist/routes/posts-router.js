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
    const idValidation = (0, express_validator_1.param)('id')
        .isString()
        .trim()
        .notEmpty()
        .exists({ checkFalsy: true });
    const titleValidation = (0, express_validator_1.body)('title')
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 1, max: 30 });
    const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription')
        .isString()
        .isLength({ min: 1, max: 100 });
    const contentValidation = (0, express_validator_1.body)('content')
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 1, max: 1000 });
    const blogIdValidation = (0, express_validator_1.body)('blogId')
        .isString()
        .trim()
        .notEmpty()
        .exists({ checkFalsy: true })
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield blogs_db_repository_1.blogsRepository.findById(value);
        console.log('62====', blog);
        if (!blog)
            throw new Error('incorrect blogId');
        return true;
    }));
    const auth = (basicString) => {
        return basicString === `Basic YWRtaW46cXdlcnR5` ? true : false;
    };
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const posts = yield posts_db_repository_1.postsRepository.findAll();
        // добавляем blogName
        let resultArray = [];
        let isCompleat = true;
        console.log('61===posts', resultArray);
        if (posts) {
            for (let post of posts) {
                const blogId = post.blogId;
                console.log('85====', blogId);
                const blogModel = yield blogs_db_repository_1.blogsRepository.findById(blogId);
                if (blogModel) {
                    const blogName = blogModel.name;
                    console.log('72===posts', Object.assign(Object.assign({}, post), { blogName }));
                    resultArray.push(Object.assign(Object.assign({}, post), { blogName }));
                }
                else {
                    console.log('92====posts');
                    isCompleat = false;
                }
            }
        }
        if (isCompleat) {
            res.status(200).json(resultArray);
        }
        else {
            res.sendStatus(445);
        }
    }));
    router.get('/:id', idValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const resId = req.params.id;
        const post = yield posts_db_repository_1.postsRepository.findById(resId);
        console.log('95===posts', post);
        // добавляем blogName
        if (post) {
            const blogId = post.blogId;
            const blogModel = yield blogs_db_repository_1.blogsRepository.findById(blogId);
            if (blogModel) {
                const blogName = blogModel.name;
                console.log('103===posts', Object.assign(Object.assign({}, post), { blogName }));
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
    router.post('/', titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const checkAuth = auth(req.headers.authorization);
        if (!checkAuth) {
            res.sendStatus(401);
            return;
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            console.log('104===', errorsMessages);
            res.status(400).send({ errorsMessages });
        }
        else {
            const { title, shortDescription, content, blogId } = req.body;
            const newPost = yield posts_db_repository_1.postsRepository.create(title, shortDescription, content, blogId);
            console.log('143=====', newPost);
            // добавляем blogName
            if (newPost) {
                const blogModel = yield blogs_db_repository_1.blogsRepository.findById(blogId);
                if (blogModel) {
                    const blogName = blogModel.name;
                    console.log('153===posts', Object.assign(Object.assign({}, newPost), { blogName }));
                    res.status(201).json(Object.assign(Object.assign({}, newPost), { blogName }));
                }
                else {
                    res.sendStatus(444);
                }
            }
            else {
                res.sendStatus(404);
            }
        }
    }));
    router.put('/:id', idValidation, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const checkAuth = auth(req.headers.authorization);
        if (!checkAuth) {
            res.sendStatus(401);
            return;
        }
        const id = req.params.id;
        const errors = (0, express_validator_1.validationResult)(req);
        console.log('147====posts', errors);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            console.log('152===posts', errorsMessages);
            res.status(400).send({ errorsMessages });
        }
        else {
            const { title, shortDescription, content, blogId } = req.body;
            const result = yield posts_db_repository_1.postsRepository.update(id, title, shortDescription, content, blogId);
            console.log('159====posts', result);
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
        console.log('226===post-auth', checkAuth);
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
