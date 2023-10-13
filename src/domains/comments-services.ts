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
  async findById(
    userId: string | null,
    id: string
  ): Promise<ViewCommentType | null> {
    console.log('37===comm.serv-userId', userId)
    console.log('41===comm.serv-userId')
    console.log('42===comm.serv-userId', id)

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
    userId: string,
    comment: ViewCommentType,
    likeStatus: string
  ): Promise<boolean> {
    let oldLikesCount: number = comment.likesInfo.likesCount || 0
    let oldDislikesCount: number = comment.likesInfo.dislikesCount || 0
    let oldStatus = comment.likesInfo.myStatus || 'None'
    let newLikesCount: number = 0
    let newDislikesCount: number = 0

    switch (oldStatus) {
      case 'None': {
        newLikesCount =
          likeStatus === 'Like' ? oldLikesCount + 1 : oldLikesCount
        newDislikesCount =
          likeStatus === 'Dislike' ? oldDislikesCount + 1 : oldDislikesCount
        break
      }
      case 'Like': {
        newLikesCount =
          likeStatus === 'Like' ? oldLikesCount : oldLikesCount - 1
        newDislikesCount =
          likeStatus === 'Dislike' ? oldDislikesCount + 1 : oldDislikesCount
        break
      }
      case 'Dislike': {
        newLikesCount =
          likeStatus === 'Like' ? oldLikesCount + 1 : oldLikesCount
        newDislikesCount =
          likeStatus === 'Dislike' ? oldDislikesCount : oldDislikesCount - 1
        break
      }
    }
    const newElement = {
      likesInfo: {
        likesCount: newLikesCount,
        dislikesCount: newDislikesCount,
        myStatus: likeStatus,
      },
    }
    return await commentsRepository.updateLikes(
      userId,
      comment.id,
      newLikesCount,
      newDislikesCount,
      likeStatus
    )
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
