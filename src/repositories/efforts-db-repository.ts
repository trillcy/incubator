import { type EffortDBType } from '../types/types'
import { EffortModel } from '../db/db'
import { ObjectId } from 'mongodb'

export const effortsRepository = {
  async countDocuments(effort: {
    IP: string
    URL: string
    inMSeconds: number
  }): Promise<number> {
    console.log('11++repo.effort', Date.now() - effort.inMSeconds)
    console.log('12++repo.effort', new Date(Date.now() - effort.inMSeconds))

    const totalCount = await EffortModel.countDocuments({
      IP: effort.IP,
      URL: effort.URL,
      date: { $gte: new Date(Date.now() - effort.inMSeconds) },
    })

    return totalCount
  },
  async create(IP: string, URL: string, date: Date): Promise<string> {
    const attempt = new EffortModel({ IP, URL, date })
    const result = await attempt.save()

    return result.id
  },

  async deleteAll(): Promise<boolean> {
    const result = await EffortModel.deleteMany({})
    const totalCount = await EffortModel.countDocuments({})
    return totalCount === 0
  },
}
