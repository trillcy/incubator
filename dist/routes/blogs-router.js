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
    // =============
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
    const blogIdValidation = (0, express_validator_1.param)('id')
        .isString()
        .trim()
        .notEmpty()
        .exists({ checkFalsy: true })
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield blogs_db_repository_1.blogsRepository.findById(value);
        console.log('56====', blog);
        if (!blog)
            throw new Error('incorrect blogId');
        return true;
    }));
    // =============
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
    router.post('/', nameValidation, descriptionValidation, websiteUrlValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('61===blogs');
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
            const newBlog = yield blogs_db_repository_1.blogsRepository.create(name, description, websiteUrl);
            res.status(201).json(newBlog);
            //===.send()
        }
    }));
    router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield blogs_db_repository_1.blogsRepository.findAll();
        res.status(200).json(result);
    }));
    router.get('/:id', idValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const resId = req.params.id;
        const result = yield blogs_db_repository_1.blogsRepository.findById(resId);
        if (result) {
            res.status(200).json(result);
        }
        else {
            res.sendStatus(404);
        }
    }));
    router.put('/:id', idValidation, nameValidation, descriptionValidation, websiteUrlValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    return router;
};
exports.blogsRouter = blogsRouter;
/*
  router.post(
    '/:id/posts',
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    async (req: Request, res: Response) => {
      const checkAuth = auth(req.headers.authorization)
      if (!checkAuth) {
        res.sendStatus(401)
        return
      }

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorsArray = errors.array({ onlyFirstError: true })
        const errorsMessages = errorsArray.map((e) => ErrorFormatter(e))

        res.status(400).send({ errorsMessages })
      } else {
        const { title, shortDescription, content } = req.body
        const blogId = req.params.id
        const newPost = await postsRepository.create(
          title,
          shortDescription,
          content,
          blogId
        )
        console.log('225=====', newPost)
        // добавляем blogName
        if (newPost) {
          const blogModel = await blogsRepository.findById(blogId)
          if (blogModel) {
            const blogName = blogModel.name
            console.log('231===posts', { ...newPost, blogName })

            res.status(201).json({ ...newPost, blogName })
          } else {
            res.sendStatus(444)
          }
        } else {
          res.sendStatus(404)
        }
      }

      res.status(200).json(req.params.id)
    }
  )
*/
