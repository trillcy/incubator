import { ObjectId } from 'mongodb'
import { UserDBType } from '../types/types'
import jwt from 'jsonwebtoken'

export const jwtService = {
  async decodeJWT(token: string) {
    const payloadData: any = jwt.decode(token)
    console.log('10+++jwt', payloadData)

    return payloadData
  },
  async createJWT(payloadData: any, key: any, expiresIn: string) {
    const token: string = jwt.sign(payloadData, key, {
      expiresIn,
    })
    console.log('10+++jwt', jwt.verify(token, key))

    const payload = jwt.decode(token, key)

    return token
  },
  async getPayloadByToken(token: string, key: any) {
    try {
      console.log('24++++jwt', token, key)

      const result: any = jwt.verify(token, key)
      console.log('27++++jwt', result)

      return result
    } catch (e) {
      console.log('31+++error in verify token:', e)
      return null
    }
  },
}
