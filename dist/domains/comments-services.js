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
exports.commentsService = void 0;
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const mongodb_1 = require("mongodb");
const comments_db_repository_1 = require("../repositories/comments-db-repository");
exports.commentsService = {
    /*
    async findAll(
      // searchNameTerm: string | undefined,
      sortBy: string | undefined,
      sortDirection: string | undefined,
      pageNumber: string | undefined,
      pageSize: string | undefined
    ): Promise<ResultPost | null> {
      return await postsRepository.findAll(
        // searchNameTerm,
        sortBy,
        sortDirection,
        pageNumber,
        pageSize
      )
    },
  */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_db_repository_1.commentsRepository.findById(id);
        });
    },
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.deleteAll();
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_db_repository_1.commentsRepository.delete(id);
        });
    },
    updateComment(id, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_db_repository_1.commentsRepository.update(id, content);
        });
    },
    createComment(content, postId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newElement = {
                _id: new mongodb_1.ObjectId(),
                content,
                commentatorInfo: { userId: user.id, userLogin: user.login },
                createdAt: new Date().toISOString(),
                postId,
            };
            const result = yield comments_db_repository_1.commentsRepository.createComment(Object.assign({}, newElement));
            if (result) {
                return {
                    id: result._id.toString(),
                    content: result.content,
                    commentatorInfo: result.commentatorInfo,
                    createdAt: result.createdAt,
                };
            }
            else {
                return null;
            }
        });
    },
};
