import { ObjectId } from 'mongodb'
import { UserDBType } from '../types/types'
import jwt from 'jsonwebtoken'

export const jwtService = {
  async createJWT(userId: string, key: any, expiresIn: string) {
    console.log('7+++jwt')

    const token: string = jwt.sign({ userId: new ObjectId(userId) }, key, {
      expiresIn,
    })

    return token
  },
  async getUserIdByToken(token: string, key: any) {
    try {
      const result: any = jwt.verify(token, key)
      return new ObjectId(result.userId)
    } catch (e) {
      return null
    }
  },
}
