import { ObjectId } from 'mongodb'
import { UserDBType } from '../types/types'
import jwt from 'jsonwebtoken'
import add from 'date-fns/add'

export const jwtService = {
  async decodeJWT(token: string) {
    const payloadData: any = jwt.decode(token)

    return payloadData
  },
  async createJWT(payloadData: any, key: any, expiresIn: string) {
    const token: string = jwt.sign(payloadData, key, {
      expiresIn,
    })

    const payload = jwt.decode(token, key)

    return token
  },
  async getPayloadByToken(token: string, key: any) {
    try {
      const result: any = jwt.verify(token, key)

      return result
    } catch (e) {
      return null
    }
  },
}
