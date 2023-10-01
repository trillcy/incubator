import {
  postsDb,
  type PostType,
  type ViewPostType,
  type ResultPost,
} from '../db/postsDb'
import { ViewCommentType, type ResultComment } from '../types/types'
import { type BlogType, CommentDBType } from '../types/types'
import { commentsCollection, postsCollection } from '../db/db'
import { blogsRepository } from './blogs-db-repository'
import { ObjectId } from 'mongodb'

const commentsFields = [
  'id',
  'commentatorInfo.userLogin',
  'commentatorInfo.userId',
  'content',
  'postId',
]

const directions = ['asc', 'desc']

export const commentsRepository = {
  async findAllComments(
    sortBy: string | undefined,
    sortDirection: string | undefined,
    pageNumber: string | undefined,
    pageSize: string | undefined,
    postId?: string | undefined
  ): Promise<ResultComment> {
    // -----
    const sortField =
      sortBy && commentsFields.includes(sortBy) ? sortBy : 'createdAt'
    const sortString =
      sortDirection && directions.includes(sortDirection)
        ? sortDirection
        : 'desc'
    const sortValue = sortString === 'desc' ? -1 : 1
    const sortObject: any = {}
    sortObject[sortField] = sortValue
    // ------
    const numberOfPage =
      pageNumber && Number.isInteger(+pageNumber) ? +pageNumber : 1
    const size = pageSize && Number.isInteger(+pageSize) ? +pageSize : 10
    const skipElements = (numberOfPage - 1) * size
    // -----

    const searchObject = postId ? { postId: postId } : {}
    // ---------
    const items = await commentsCollection
      .find(searchObject) //, { projection: { _id: 0 } }
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .toArray()

    const totalCount = await commentsCollection.countDocuments(searchObject)
    const pagesCount = Math.ceil(totalCount / size)
    const resultArray = []
    // if (items.length) {
    for (let item of items) {
      const object: ViewCommentType = {
        id: item._id.toString(),
        content: item.content,
        commentatorInfo: {
          userId: item.commentatorInfo.userId,
          userLogin: item.commentatorInfo.userLogin,
        },
        createdAt: item.createdAt,
      }
      resultArray.push(object)
    }
    const result: ResultComment = {
      pagesCount,
      page: numberOfPage,
      pageSize: size,
      totalCount,
      items: resultArray,
    }
    return result
  },

  async findById(id: string): Promise<ViewCommentType | null> {
    const result = await commentsCollection.findOne({ _id: new ObjectId(id) })
    if (result) {
      return {
        id: result._id.toString(),
        content: result.content,
        commentatorInfo: {
          userLogin: result.commentatorInfo.userLogin,
          userId: result.commentatorInfo.userId,
        },
        createdAt: result.createdAt,
      }
      // =====
    } else {
      return null
    }
  },

  async deleteAll(): Promise<boolean> {
    const result = await commentsCollection.deleteMany({})
    const totalCount = await commentsCollection.countDocuments({})
    return totalCount === 0
  },

  async delete(id: string): Promise<boolean> {
    const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  },

  async update(id: string, content: string): Promise<boolean> {
    const result = await commentsCollection.updateOne(
      { id: new ObjectId(id) },
      {
        $set: {
          content: content,
        },
      }
    )
    if (result.matchedCount === 1) {
      return true
    } else {
      return false
    }
  },

  async createComment(newElement: CommentDBType): Promise<CommentDBType> {
    const result = await commentsCollection.insertOne({ ...newElement })
    return newElement
  },
}