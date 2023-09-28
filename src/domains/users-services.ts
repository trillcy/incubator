import { UserDBType, type ViewUserType } from '../db/types'
import { blogsRepository } from '../repositories/blogs-db-repository'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { usersRepository } from '../repositories/users-db-repository'

export const usersService = {
  async deleteUser(id: string): Promise<boolean> {
    return await usersRepository.delete(id)
  },
  async createUser(
    login: string,
    email: string,
    password: string
  ): Promise<ViewUserType | null> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)
    const date = new Date()
    const id = `${Math.floor(Math.random() * 30)}-${date.toISOString()}`
    const newElement: UserDBType = {
      // _id: new ObjectId(),
      id,
      login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: date.toISOString(),
    }

    const result = await usersRepository.create(newElement)

    return result
  },
  async _generateHash(password: string, salt: string) {
    return bcrypt.hash(password, salt)
  },
}
