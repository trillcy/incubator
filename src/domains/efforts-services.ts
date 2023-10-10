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
    limitDate: number
  ): Promise<EffortDBType | null> {
    const newElement: EffortDBType = {
      IP,
      URL,
      time: limitDate,
    }
    return await effortsRepository.create({ ...newElement })
  },
}
