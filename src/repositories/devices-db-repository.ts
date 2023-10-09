import { postsDb, type PostType, type ResultPost } from '../db/postsDb'
import { type ViewDeviceType, DeviceDBType } from '../types/types'
import { postsCollection, devicesCollection } from '../db/db'
import { ObjectId } from 'mongodb'

export const devicesRepository = {
  async countEfforts(deviceId: string, activeDate: Date): Promise<number> {
    const totalCount = await devicesCollection.countDocuments({
      deviceId,
      lastActiveDate: { $gte: activeDate },
    })

    return totalCount
  },

  async findAll(userId: string): Promise<ViewDeviceType[]> {
    // -----
    const result = await devicesCollection.find({ userId }).toArray()

    return result.map((item) => {
      return {
        ip: item.ip,
        title: item.title,
        deviceId: item.deviceId,
        lastActiveDate: item.lastActiveDate.toISOString(),
        // userId: item.userId,
      }
    })
  },

  async findByDevice(deviceId: string): Promise<DeviceDBType | null> {
    return await devicesCollection.findOne({ deviceId })
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
    const result = await devicesCollection.deleteMany({})
    const totalCount = await devicesCollection.countDocuments({})
    return totalCount === 0
  },

  async deleteWithoutCurrent(
    userId: string,
    currentDeviceId: string
  ): Promise<boolean> {
    const result = await devicesCollection.deleteMany({
      userId,
      deviceId: { $nin: [currentDeviceId] },
    })
    console.log('114----', result)

    return result.acknowledged
  },

  async deleteUserDevice(userId: string, deviceId: string): Promise<boolean> {
    const result = await devicesCollection.deleteMany({ userId, deviceId })
    return result.acknowledged
  },
  async deleteOneDevice(deviceId: string): Promise<boolean> {
    const result = await devicesCollection.deleteMany({ deviceId })
    return result.acknowledged
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
  async createDevice(newElement: DeviceDBType): Promise<ViewDeviceType | null> {
    const result = await devicesCollection.insertOne({ ...newElement })
    console.log('169++++sess', result)

    if (result.acknowledged) {
      return {
        ip: newElement.ip,
        title: newElement.title,
        deviceId: newElement.deviceId,
        lastActiveDate: newElement.lastActiveDate.toISOString(),
        // userId: newElement.userId,
      }
    } else {
      return null
    }
  },
}