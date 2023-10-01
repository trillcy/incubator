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
const postsDb_1 = require("../db/postsDb");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
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
  
    async findById(id: string): Promise<PostType | null> {
      return await postsRepository.findById(id)
    },
  
    async deleteAll(): Promise<boolean> {
      return await postsRepository.deleteAll()
    },
  
    async delete(id: string): Promise<boolean> {
      return await postsRepository.delete(id)
    },
  
    async update(
      id: string,
      title: string,
      shortDescription: string,
      content: string,
      blogId: string
    ): Promise<boolean> {
      const blogModel = await blogsRepository.findById(blogId)
      if (!blogModel) {
        return false
      }
  
      return await postsRepository.update(
        id,
        title,
        shortDescription,
        content,
        blogId
      )
    },
  */
    createComment(content, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogModel = yield blogs_db_repository_1.blogsRepository.findById(blogId);
            if (!blogModel)
                return null;
            const blogName = blogModel.name;
            "createdAt";
            "2023-09-30T11:12:46.504Z";
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
