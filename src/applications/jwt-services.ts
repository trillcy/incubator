import { ObjectId } from 'mongodb'
import { UserDBType } from '../types/types'
import jwt from 'jsonwebtoken'

export const jwtService = {
  async createJWT(userId: string, key: any, expiresIn: string) {
    const token: string = jwt.sign({ userId: new ObjectId(userId) }, key, {
      expiresIn,
    })
    console.log('10+++jwt', jwt.verify(token, key))

    return token
  },
  async getUserIdByToken(token: string, key: any) {
    try {
      console.log('16++++jwt', token, key)

      const result: any = jwt.verify(token, key)
      console.log('17++++jwt', result)

      return new ObjectId(result.userId)
    } catch (e) {
      return null
    }
  },
}
