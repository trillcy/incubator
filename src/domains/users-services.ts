import { type UserDBType, type ViewUserType } from '../types/types'
import { blogsRepository } from '../repositories/blogs-db-repository'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { usersRepository } from '../repositories/users-db-repository'

export const usersService = {
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
      passwordConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: false,
      },
      deletedTokens: [],
    }
    console.log('37===users', newElement)

    const userId: string = await usersRepository.create({
      ...newElement,
    })
    const result = await usersRepository.findById(userId)
    if (!result) return null
    return {
      id: result.id,
      login: result.accountData.userName.login,
      email: result.accountData.userName.email,
      createdAt: result.accountData.createdAt.toISOString(),
    }
  },
  async _generateHash(password: string, salt: string) {
    return bcrypt.hash(password, salt)
  },
}
