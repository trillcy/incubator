import {
  DeviceDBType,
  type EffortDBType,
  type ViewUserType,
} from '../types/types'
import { devicesRepository } from '../repositories/devices-db-repository'
import { ObjectId } from 'mongodb'
import { effortsRepository } from '../repositories/efforts-db-repository'

export const effortsService = {
  async createEffort(
    IP: string,
    URL: string,
    date: Date
  ): Promise<EffortDBType | null> {
    const newElement: EffortDBType = {
      IP,
      URL,
      date,
    }
    return await effortsRepository.create({ ...newElement })
  },
}
