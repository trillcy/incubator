import { UserDBType, type ViewUserType } from '../db/types'
import { blogsRepository } from '../repositories/blogs-db-repository'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { usersRepository } from '../repositories/users-db-repository'

export const authService = {
  async checkCredential(
    loginOrEmail: string,
    password: string
  ): Promise<boolean> {
    const date = new Date()
    console.log('123----')

    const id = `${Math.floor(Math.random() * 30)}-${date.toISOString()}`

    const user: UserDBType | null =
      await usersRepository.findUserByLoginOrEmail(loginOrEmail)
    if (!user) return false
    const passwordHash = await bcrypt.hash(password, user.passwordSalt)
    if (user.passwordHash !== passwordHash) return false
    return true
  },
}
