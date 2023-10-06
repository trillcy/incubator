import {
  EmailBody,
  type UserDBType,
  type ViewUserType,
  type ViewEmailUserType,
} from '../types/types'
import { blogsRepository } from '../repositories/blogs-db-repository'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { usersRepository } from '../repositories/users-db-repository'
import { usersService } from './users-services'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { emailManager } from '../managers/emails-managers'

export const authService = {
  async confirmationCode(code: string): Promise<boolean> {
    // находим пользователя по code
    const user = await usersRepository.findByCode(code)
    console.log('15===auth', user)

    if (user) {
      const newElement = {
        emailConfirmation: {
          confirmationCode: user.emailConfirmation.confirmationCode,
          expirationDate: user.emailConfirmation.expirationDate,
          isConfirmed: true,
        },
      }
      return await usersRepository.updateUser(new ObjectId(user.id), newElement)
    }
    return false
  },

  async sendRegistraitonEmail(
    userId: string,
    email: string
  ): Promise<any | null> {
    console.log('25====auth.serv', userId)
    const updatedObject = {
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
        isConfirmed: false,
      },
    }
    const updatedUser = await usersRepository.updateUser(
      new ObjectId(userId),
      updatedObject
    )
    console.log('48====auth', updatedUser)

    if (!updatedUser) {
      return null
    }
    const url = `https://somesite.com/confirm-registration?code=${updatedObject.emailConfirmation.confirmationCode}`

    const emailObject: EmailBody = {
      // const email: user.email,
      email: email, //`aermakov72@mail.ru`,
      message: `<h1>Thank for your registration</h1>
<p>To finish registration please follow the link below:
<a href=${url}>complete registration</a>
</p>`,
      subject: `Confirmation of registration`,
    }
    console.log('41=====auth', emailObject)

    return await emailManager.sendEmailConfirmationMessage(emailObject)
  },

  async checkCredential(
    loginOrEmail: string,
    password: string
  ): Promise<UserDBType | null> {
    const user: UserDBType | null =
      await usersRepository.findUserByLoginOrEmail(loginOrEmail)

    if (!user) return null
    const passwordHash = await bcrypt.hash(
      password,
      user.accountData.passwordSalt
    )
    if (user.accountData.passwordHash !== passwordHash) return null

    return user
  },

  async emailResending(email: string): Promise<ViewEmailUserType | null> {
    const user: ViewEmailUserType | null = await usersRepository.findByEmail(
      email
    )
    if (!user) {
      return null
    }
    console.log('96====auth', user.id, email)

    return await this.sendRegistraitonEmail(user.id, email)
  },

  async registration(
    login: string,
    email: string,
    password: string
  ): Promise<ViewEmailUserType | null> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, passwordSalt)

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
        confirmationCode: uuidv4(),
        expirationDate: add(date, { hours: 1, minutes: 3 }),
        isConfirmed: false,
      },
    }

    const user: ViewUserType | null = await usersRepository.create(newElement)
    if (!user) {
      return null
    }
    return await this.sendRegistraitonEmail(user.id, user.email)
  },
}
