import {
  postsDb,
  type PostType,
  type ViewPostType,
  type ResultPost,
} from '../db/postsDb'
import { BlogType } from '../types/types'
import { postsCollection } from '../db/db'
import { blogsRepository } from './blogs-db-repository'
import { ObjectId } from 'mongodb'

const postsFields = [
  'id',
  'title',
  'shortDescription',
  'content',
  'blogId',
  'blogName',
]

const postsDirections = ['asc', 'desc']

export const postsRepository = {
  async findAll(
    sortBy: string | undefined,
    sortDirection: string | undefined,
    pageNumber: string | undefined,
    pageSize: string | undefined,
    blogId?: string | undefined
  ): Promise<ResultPost | null> {
    // -----
    const sortField =
      sortBy && postsFields.includes(sortBy) ? sortBy : 'createdAt'
    const sortString =
      sortDirection && postsDirections.includes(sortDirection)
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

    const searchObject = blogId ? { blogId: blogId } : {}
    // ---------
    const items = await postsCollection
      .find(searchObject, { projection: { _id: 0 } })
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .toArray()

    const totalCount = await postsCollection.countDocuments(searchObject)
    const pagesCount = Math.ceil(totalCount / size)
    const resultArray = []
    if (items.length) {
      for (let item of items) {
        const blogModel: BlogType | null = await blogsRepository.findById(
          item.blogId
        )
        if (blogModel) {
          const object: ViewPostType = {
            id: item.id,
            title: item.title,
            shortDescription: item.shortDescription,
            content: item.content,
            blogId: item.blogId,
            blogName: blogModel.name,
            createdAt: item.createdAt,
          }
          resultArray.push(object)
        } else {
          return null
        }
      }
      const result: ResultPost = {
        pagesCount,
        page: numberOfPage,
        pageSize: size,
        totalCount,
        items: resultArray,
      }
      return result
    } else {
      return null
    }
  },

  async findById(id: string): Promise<PostType | null> {
    // const result = await postsCollection.findOne(
    //   { id: id },
    //   { projection: { _id: 0 } }
    // )
    const result = await postsCollection.findOne(
      { _id: new ObjectId(id) }
      // { projection: { _id: 0 } }
    )
    if (result) {
      // return result
      // ====
      return {
        id: result._id.toString(),
        title: result.title,
        shortDescription: result.shortDescription,
        content: result.content,
        blogId: result.blogId,
        createdAt: result.createdAt,
      }
      // =====
    } else {
      return null
    }
  },

  async deleteAll(): Promise<boolean> {
    const result = await postsCollection.deleteMany({})
    const totalCount = await postsCollection.countDocuments({})
    return totalCount === 0
  },

  async delete(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({ id: id })
    return result.deletedCount === 1
  },

  async update(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<boolean> {
    const result = await postsCollection.updateOne(
      { id: id },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
        },
      }
    )
    if (result.matchedCount === 1) {
      return true
    } else {
      return false
    }
  },

  async create(newElement: PostType): Promise<PostType> {
    await postsCollection.insertOne({ ...newElement })
    return newElement
  },
}
