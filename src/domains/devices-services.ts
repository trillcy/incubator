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
    return await devicesRepository.deleteOneDevice(deviceId)
  },

  async deleteUserDevicesWithoutCurrent(
    userId: string,
    deviceId: string
  ): Promise<boolean> {
    // const transformId = id.
    return await devicesRepository.deleteUserDevicesWithoutCurrent(
      userId,
      deviceId
    )
  },

  async deleteCurrentDevice(
    userId: string,
    deviceId: string
  ): Promise<boolean | null> {
    // const transformId = id.
    return await devicesRepository.deleteCurrentDevice(userId, deviceId)
  },

  async updateDevice(
    deviceId: string,
    ip: string,
    lastActiveDate: Date
  ): Promise<boolean> {
    return await devicesRepository.update(deviceId, ip, lastActiveDate)
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
