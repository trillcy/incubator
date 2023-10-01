import { ObjectId } from 'mongodb'
import { UserDBType } from '../types/types'
import jwt from 'jsonwebtoken'

export const jwtService = {
  async createJWT(user: UserDBType) {
    const token: string = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY || '123',
      {
        expiresIn: '1h',
      }
    )

    return token
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, process.env.SECRET_KEY || '123')
      return new ObjectId(result.userId)
    } catch (e) {
      return null
    }
  },
}
