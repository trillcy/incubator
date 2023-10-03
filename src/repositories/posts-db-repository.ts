import { postsDb, type PostType, type ResultPost } from '../db/postsDb'
import { type ViewBlogType, PostDBType, ViewPostType } from '../types/types'
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
  ): Promise<ResultPost> {
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
      .find(searchObject) //, { projection: { _id: 0 } })
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .toArray()

    const totalCount = await postsCollection.countDocuments(searchObject)
    const pagesCount = Math.ceil(totalCount / size)
    // const resultArray = []
    // if (items.length) {
    //   for (let item of items) {
    // const blogModel: ViewBlogType | null = await blogsRepository.findById(
    //   item.blogId
    // )
    // if (blogModel) {
    const object: ViewPostType[] = items.map((item) => {
      return {
        id: item._id.toString(),
        title: item.title,
        shortDescription: item.shortDescription,
        content: item.content,
        blogId: item.blogId,
        blogName: item.blogName,
        createdAt: item.createdAt,
      }
    })
    // resultArray.push(object)
    // } else {
    //   return null
    // }
    // }
    const result: ResultPost = {
      pagesCount,
      page: numberOfPage,
      pageSize: size,
      totalCount,
      items: object,
    }
    return result
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
    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) })
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
      { _id: new ObjectId(id) },
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

  async create(newElement: PostDBType): Promise<ViewPostType | null> {
    const result = await postsCollection.insertOne({ ...newElement })
    if (result.acknowledged) {
      return {
        id: result.insertedId.toString(),
        title: newElement.title,
        shortDescription: newElement.shortDescription,
        content: newElement.content,
        blogId: newElement.blogId,
        blogName: newElement.blogName,
        createdAt: newElement.createdAt,
      }
    } else {
      return null
    }
  },
}
