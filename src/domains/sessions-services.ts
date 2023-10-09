import {
  SessionDBType,
  type ViewSessionType,
  type ViewUserType,
} from '../types/types'
import { sessionsRepository } from '../repositories/sessions-db-repository'
import { ObjectId } from 'mongodb'

export const sessionsService = {
  async deleteSession(
    userId: string,
    currentDeviceId: string
  ): Promise<boolean | null> {
    // const transformId = id.
    return await sessionsRepository.deleteDevice(userId, currentDeviceId)
  },

  async createSession(
    IP: string,
    URL: string,
    deviceId: string,
    expireDate: Date,
    userId: string
  ): Promise<ViewSessionType | null> {
    const newElement: SessionDBType = {
      _id: new ObjectId(),
      IP,
      URL,
      deviceId,
      expireDate,
      userId,
    }
    // const transformId = id.
    return await sessionsRepository.createSession({ ...newElement })
  },
}
