import { type EffortDBType } from '../types/types'
import { effortsCollection } from '../db/db'
import { ObjectId } from 'mongodb'

export const effortsRepository = {
  async countDocuments(effort: {
    IP: string
    URL: string
    limitDate: number
  }): Promise<number> {
    console.log('11++repo.effort', effort.limitDate - Date.now())

    const totalCount = await effortsCollection.countDocuments({
      IP: effort.IP,
      URL: effort.URL,
      time: { $gte: effort.limitDate },
    })

    return totalCount
  },
  async create(newElement: EffortDBType): Promise<EffortDBType | null> {
    const result = await effortsCollection.insertOne({ ...newElement })

    if (result.acknowledged) {
      return {
        IP: newElement.IP,
        URL: newElement.URL,
        time: newElement.time,
      }
    } else {
      return null
    }
  },

  /*
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

  */
}
