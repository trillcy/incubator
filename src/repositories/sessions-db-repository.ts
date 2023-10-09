import { postsDb, type PostType, type ResultPost } from '../db/postsDb'
import {
  type ViewSessionType,
  ResultSession,
  SessionDBType,
  ViewPostType,
} from '../types/types'
import { postsCollection, sessionCollection } from '../db/db'
import { blogsRepository } from './blogs-db-repository'
import { ObjectId } from 'mongodb'

const sessionsFields = ['id', 'IP', 'URL', 'expireDate', 'userId']

const sessionsDirections = ['asc', 'desc']

export const sessionsRepository = {
  async countDates(userId: string, date: Date): Promise<number> {
    const totalCount = await sessionCollection.countDocuments({
      userId,
      expireDate: { $gte: date },
    })
    return totalCount
  },

  async findAll(
    sortBy: string | undefined,
    sortDirection: string | undefined,
    pageNumber: string | undefined,
    pageSize: string | undefined,
    userId: string
  ): Promise<ResultSession> {
    // -----
    const sortField =
      sortBy && sessionsFields.includes(sortBy) ? sortBy : 'expireDate'
    const sortString =
      sortDirection && sessionsDirections.includes(sortDirection)
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

    // ---------
    const items = await sessionCollection
      .find({ userId })
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .toArray()

    const totalCount = await sessionCollection.countDocuments({ userId })
    const pagesCount = Math.ceil(totalCount / size)
    const object: ViewSessionType[] = items.map((item) => {
      return {
        id: item._id.toString(),
        IP: item.IP,
        URL: item.URL,
        deviceId: item.deviceId,
        expireDate: item.expireDate,
        userId: item.userId,
      }
    })
    const result: ResultSession = {
      pagesCount,
      page: numberOfPage,
      pageSize: size,
      totalCount,
      items: object,
    }
    return result
  },

  async findByDevice(deviceId: string): Promise<ViewSessionType | null> {
    const result = await sessionCollection.findOne({ deviceId })
    if (result) {
      return {
        IP: result.IP,
        URL: result.URL,
        expireDate: result.expireDate,
        deviceId: result.deviceId,
        userId: result.userId,
      }
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
    const result = await sessionCollection.deleteMany({})
    const totalCount = await sessionCollection.countDocuments({})
    return totalCount === 0
  },

  async delete(userId: string, currentDeviceId: string): Promise<boolean> {
    const result = await sessionCollection.deleteMany({
      userId,
      deviceId: { $nin: [currentDeviceId] },
    })
    console.log('114----', result)

    return true
  },

  async deleteDevice(userId: string, deviceId: string): Promise<boolean> {
    const result = await sessionCollection.deleteOne({ userId, deviceId })
    return result.deletedCount === 1
  },
  /*
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
*/
  async createSession(
    newElement: SessionDBType
  ): Promise<ViewSessionType | null> {
    const result = await sessionCollection.insertOne({ ...newElement })
    console.log('169++++sess', result)

    if (result.acknowledged) {
      return {
        IP: newElement.IP,
        URL: newElement.URL,
        deviceId: newElement.deviceId,
        expireDate: newElement.expireDate,
        userId: newElement.userId,
      }
    } else {
      return null
    }
  },
}
