import { UserDBType, type ViewUserType } from '../types/types'
import { blogsRepository } from '../repositories/blogs-db-repository'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { usersRepository } from '../repositories/users-db-repository'

export const authService = {
  async checkCredential(
    loginOrEmail: string,
    password: string
  ): Promise<UserDBType | null> {
    console.log('12===auth.serv', loginOrEmail, password)

    const user: UserDBType | null =
      await usersRepository.findUserByLoginOrEmail(loginOrEmail)
    console.log('16===auth.serv', user)

    if (!user) return null
    const passwordHash = await bcrypt.hash(password, user.passwordSalt)
    if (user.passwordHash !== passwordHash) return null

    return user
  },
}
