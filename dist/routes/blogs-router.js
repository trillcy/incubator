"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const express_validator_1 = require("express-validator");
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
    const idValidation = (0, express_validator_1.param)('id')
        .isString()
        .trim()
        .notEmpty()
        .exists({ checkFalsy: true });
    const nameValidation = (0, express_validator_1.body)('name')
        // .custom(({ req }) => {
        //   return `Basic YWRtaW46cXdlcnR5` === req.headers.authorization
        // })
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 1, max: 15 });
    const descriptionValidation = (0, express_validator_1.body)('description')
        .isString()
        .isLength({ min: 1, max: 500 });
    const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl').isString().isURL();
    const auth = (basicString) => {
        return basicString === `Basic YWRtaW46cXdlcnR5` ? true : false;
    };
    router.post('/', nameValidation, descriptionValidation, websiteUrlValidation, (req, res) => {
        const checkAuth = auth(req.headers.authorization);
        if (!checkAuth) {
            res.sendStatus(401);
            return;
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            console.log('74===', errorsMessages);
            res.status(400).send({ errorsMessages });
        }
        else {
            const { name, description, websiteUrl } = req.body;
            const newBlog = blogs_repository_1.blogsRepository.create(name, description, websiteUrl);
            res.status(201).json(newBlog); //===.send()
        }
    });
    router.get('/', (req, res) => {
        const result = blogs_repository_1.blogsRepository.findAll();
        console.log('10===blogs', result);
        res.status(200).json(result);
    });
    router.get('/:id', idValidation, (req, res) => {
        const resId = req.params.id;
        const result = blogs_repository_1.blogsRepository.findOne(resId);
        console.log('25===blogs', result);
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.sendStatus(404);
        }
    });
    router.put('/:id', idValidation, nameValidation, descriptionValidation, websiteUrlValidation, (req, res) => {
        const checkAuth = auth(req.headers.authorization);
        if (!checkAuth) {
            res.sendStatus(401);
            return;
        }
        const id = req.params.id;
        const errors = (0, express_validator_1.validationResult)(req);
        console.log('48====', errors);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            console.log('74===', errorsMessages);
            res.status(400).send({ errorsMessages });
        }
        else {
            const { name, description, websiteUrl } = req.body;
            const result = blogs_repository_1.blogsRepository.update(id, name, description, websiteUrl);
            console.log('140====', result);
            if (result) {
                res.sendStatus(204);
                return;
            }
            else {
                res.sendStatus(404);
            }
        }
    });
    router.delete('/:id', (req, res) => {
        const checkAuth = auth(req.headers.authorization);
        if (!checkAuth) {
            res.sendStatus(401);
            return;
        }
        const id = req.params.id;
        console.log('281===', id);
        const result = blogs_repository_1.blogsRepository.delete(id);
        console.log('283===', result);
        if (result) {
            res.sendStatus(204);
        }
        else {
            res.sendStatus(404);
        }
    });
    return router;
};
exports.blogsRouter = blogsRouter;
