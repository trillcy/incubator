import {
  postsDb,
  type PostType,
  type ViewPostType,
  type ResultPost,
} from '../db/postsDb'
import { blogsCollection, db, postsCollection } from '../db/db'
import { postsRepository } from '../repositories/posts-db-repository'
import { blogsRepository } from '../repositories/blogs-db-repository'
import {
  type ViewCommentType,
  ViewUserType,
  CommentDBType,
} from '../types/types'
import { ObjectId } from 'mongodb'
import { commentsRepository } from '../repositories/comments-db-repository'

export const commentsService = {
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
  async findById(id: string): Promise<ViewCommentType | null> {
    return await commentsRepository.findById(id)
  },

  async deleteAll(): Promise<boolean> {
    return await postsRepository.deleteAll()
  },

  async deleteComment(id: string): Promise<boolean> {
    return await commentsRepository.delete(id)
  },

  async updateComment(id: string, content: string): Promise<boolean> {
    return await commentsRepository.update(id, content)
  },

  async createComment(
    content: string,
    postId: string,
    user: ViewUserType
  ): Promise<ViewCommentType | null> {
    const newElement: CommentDBType = {
      _id: new ObjectId(),
      content,
      commentatorInfo: { userId: user.id, userLogin: user.login },
      createdAt: new Date().toISOString(),
      postId,
    }

    const result = await commentsRepository.createComment({ ...newElement })
    if (result) {
      return {
        id: result._id.toString(),
        content: result.content,
        commentatorInfo: result.commentatorInfo,
        createdAt: result.createdAt,
      }
    } else {
      return null
    }
  },
}
