import { type UserDBType, type ViewUserType } from '../types/types'
import { blogsRepository } from '../repositories/blogs-db-repository'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { usersRepository } from '../repositories/users-db-repository'

export const usersService = {
  async findUserById(id: ObjectId) {
    return await usersRepository.findById(id)
  },
  async deleteUser(id: string): Promise<boolean | null> {
    // const transformId = id.
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
    const newElement: UserDBType = {
      _id: new ObjectId(),
      accountData: {
        userName: { login, email },
        passwordHash,
        passwordSalt,
        createdAt: date,
      },
      emailConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: false,
      },
    }
    console.log('37===users', newElement)

    const result = await usersRepository.create({ ...newElement })

    return result
  },
  async _generateHash(password: string, salt: string) {
    return bcrypt.hash(password, salt)
  },
}
