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
exports.validationMiidleware = void 0;
const express_validator_1 = require("express-validator");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
exports.validationMiidleware = {
    titleValidation: (0, express_validator_1.body)('title')
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 1, max: 30 }),
    shortDescriptionValidation: (0, express_validator_1.body)('shortDescription')
        .isString()
        .isLength({ min: 1, max: 100 }),
    contentValidation: (0, express_validator_1.body)('content')
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 1, max: 1000 }),
    blogIdValidation: (0, express_validator_1.body)('id')
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
    })),
    // =============
    idValidation: (0, express_validator_1.param)('id')
        .isString()
        .trim()
        .notEmpty()
        .exists({ checkFalsy: true }),
    nameValidation: (0, express_validator_1.body)('name')
        // .custom(({ req }) => {
        //   return `Basic YWRtaW46cXdlcnR5` === req.headers.authorization
        // })
        .isString()
        .trim()
        .notEmpty()
        .isLength({ min: 1, max: 15 }),
    descriptionValidation: (0, express_validator_1.body)('description')
        .isString()
        .isLength({ min: 1, max: 500 }),
    websiteUrlValidation: (0, express_validator_1.body)('websiteUrl').isString().isURL(),
    auth: (basicString) => {
        return basicString === `Basic YWRtaW46cXdlcnR5` ? true : false;
    },
};
