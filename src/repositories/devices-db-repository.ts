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
      }
    })
  },

  async findByDevice(deviceId: string): Promise<DeviceDBType | null> {
    return await devicesCollection.findOne({ deviceId })
  },

  async findById(id: string): Promise<ViewDeviceType | null> {
    const result = await devicesCollection.findOne({ _id: new ObjectId(id) })
    if (result) {
      return {
        ip: result.ip,
        title: result.title,
        deviceId: result.deviceId,
        lastActiveDate: result.lastActiveDate.toISOString(),
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

  async deleteCurrentDevice(
    userId: string,
    currentDeviceId: string
  ): Promise<boolean> {
    const result = await devicesCollection.deleteMany({
      userId,
      deviceId: currentDeviceId,
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

  async update(
    deviceId: string,
    ip: string,
    lastActiveDate: Date
  ): Promise<boolean> {
    const result = await postsCollection.updateOne(
      { deviceId },
      {
        $set: {
          ip: ip,
          lastActiveDate: lastActiveDate,
        },
      }
    )
    if (result.matchedCount === 1) {
      return true
    } else {
      return false
    }
  },

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
