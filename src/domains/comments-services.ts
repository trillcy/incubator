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
  async findById(userId: string, id: string): Promise<ViewCommentType | null> {
    return await commentsRepository.findById(userId, id)
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

  async updateLikeStatus(
    comment: ViewCommentType,
    likeStatus: string
  ): Promise<boolean> {
    const newElement = {
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: likeStatus,
      },
    }
    return await commentsRepository.updateLikes(comment.id, newElement)
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
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        statuses: [],
      },
    }

    const result = await commentsRepository.createComment({ ...newElement })
    if (result) {
      return {
        id: result._id.toString(),
        content: result.content,
        commentatorInfo: result.commentatorInfo,
        createdAt: result.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      }
    } else {
      return null
    }
  },
}
