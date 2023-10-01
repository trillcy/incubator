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
exports.commentsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middlewares/validation");
const authMiddlware_1 = require("../middlewares/authMiddlware");
const comments_services_1 = require("../domains/comments-services");
const comments_db_repository_1 = require("../repositories/comments-db-repository");
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
const commentsRouter = () => {
    const router = (0, express_1.Router)();
    router.put('/:id', authMiddlware_1.authMiidleware, validation_1.validationMiidleware.commentContentValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array({ onlyFirstError: true });
            const errorsMessages = errorsArray.map((e) => ErrorFormatter(e));
            res.status(400).send({ errorsMessages });
        }
        else {
            const commentId = req.params.id;
            const owner = yield comments_services_1.commentsService.findById(commentId);
            if (owner) {
                if (owner.commentatorInfo.userId !== req.user.id) {
                    res.sendStatus(403);
                }
                const { content } = req.body;
                const result = yield comments_services_1.commentsService.updateComment(id, content);
                if (result) {
                    res.sendStatus(204);
                    return;
                }
                else {
                    res.sendStatus(404);
                }
            }
            else {
                res.sendStatus(404);
            }
        }
    }));
    router.delete('/:id', authMiddlware_1.authMiidleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const commentId = req.params.id;
        const owner = yield comments_services_1.commentsService.findById(commentId);
        if (owner) {
            if (owner.commentatorInfo.userId !== req.user.id) {
                res.sendStatus(403);
            }
            const result = yield comments_services_1.commentsService.deleteComment(commentId);
            if (result) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        }
        else {
            res.sendStatus(404);
        }
    }));
    router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const commentId = req.params.id;
        const comment = yield comments_db_repository_1.commentsRepository.findById(commentId);
        // добавляем blogName
        if (comment) {
            res.status(200).json(comment);
        }
        else {
            res.sendStatus(404);
        }
    }));
    /*
    router.get('/', async (req: Request, res: Response) => {
      const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
        req.query
      const result: any = await blogsRepository.findAll(
        searchNameTerm?.toString(),
        sortBy?.toString(),
        sortDirection?.toString(),
        pageNumber?.toString(),
        pageSize?.toString()
      )
  
      res.status(200).json(result)
    })
  */
    return router;
};
exports.commentsRouter = commentsRouter;
