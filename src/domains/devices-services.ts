import {
  DeviceDBType,
  type ViewDeviceType,
  type ViewUserType,
} from '../types/types'
import { devicesRepository } from '../repositories/devices-db-repository'
import { ObjectId } from 'mongodb'

export const devicesService = {
  async deleteDevice(deviceId: string): Promise<boolean | null> {
    // const transformId = id.
    return await devicesRepository.deleteDevice(deviceId)
  },

  async deleteDevicesWithoutCurrent(deviceId: string): Promise<boolean | null> {
    // const transformId = id.
    return await devicesRepository.deleteWithoutCurrent(deviceId)
  },

  async createDevice(
    ip: string,
    title: string,
    deviceId: string,
    lastActiveDate: Date,
    userId: string
  ): Promise<ViewDeviceType | null> {
    const newElement: DeviceDBType = {
      _id: new ObjectId(),
      ip,
      title,
      deviceId,
      lastActiveDate,
      userId,
    }
    // const transformId = id.
    return await devicesRepository.createDevice({ ...newElement })
  },
}
