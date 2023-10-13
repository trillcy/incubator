import {
  EmailBody,
  type UserDBType,
  type ViewCompleteUserType,
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
import { jwtService } from '../applications/jwt-services'
import { keys } from '../db/db'

export const authService = {
  async getUserIdInAccessToken(accessToken: string): Promise<string | null> {
    // TODO: проверить наличие пользователя и валидность токена
    const token = accessToken.split(' ')[1]
    const payloadObject = await jwtService.getPayloadByToken(token, keys.access)

    // return payloadObject.user.id
    return payloadObject.userId
  },

  async sendPasswordRecoveryEmail(
    userId: string,
    email: string
  ): Promise<any | null> {
    let userModel
    const updatedObject = {
      passwordConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
        isConfirmed: false,
      },
    }

    const updatedUser = await usersRepository.updateUserPwdConf(
      userId,
      updatedObject
    )

    if (!updatedUser) {
      return null
    }
    userModel = await usersRepository.findById(userId)

    if (!userModel) return null
    const url = `https://somesite.com/password-recovery?recoveryCode=${userModel.passwordConfirmation.confirmationCode}`

    const emailObject: EmailBody = {
      // const email: user.email,
      email: email, //`aermakov72@mail.ru`,
      message: ` <h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
         <a href=${url}>recovery password</a>
     </p>
   `,
      subject: `Password recovery`,
    }

    return await emailManager.sendEmailConfirmationMessage(emailObject)
  },

  async deleteRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<boolean> {
    const user = await usersRepository.findById(userId)
    if (!user) {
      return false
    }
    const deletedTokens = user.deletedTokens
    deletedTokens.push(refreshToken)
    const newElement = {
      deletedTokens,
    }
    return await usersRepository.updateUser(user.id, newElement)
  },

  async confirmationPasswordCode(
    code: string
  ): Promise<ViewCompleteUserType | null> {
    // находим пользователя по code
    const user = await usersRepository.findByPwdCode(code)

    if (user) {
      const newElement = {
        passwordConfirmation: {
          confirmationCode: user.passwordConfirmation.confirmationCode,
          expirationDate: user.passwordConfirmation.expirationDate,
          isConfirmed: true,
        },
      }

      const updated = await usersRepository.updateUserPwdConf(
        user.id,
        newElement
      )

      if (updated) {
        return user
      } else {
        return null
      }
    }
    return null
  },

  async confirmationCode(code: string): Promise<ViewCompleteUserType | null> {
    // находим пользователя по code
    const user = await usersRepository.findByCode(code)

    if (user) {
      const newElement = {
        emailConfirmation: {
          confirmationCode: user.emailConfirmation.confirmationCode,
          expirationDate: user.emailConfirmation.expirationDate,
          isConfirmed: true,
        },
      }

      const updated = await usersRepository.updateUserEmailConf(
        user.id,
        newElement
      )

      if (updated) {
        return user
      } else {
        return null
      }
    }
    return null
  },

  async updatePassword(
    user: ViewCompleteUserType,
    password: string
  ): Promise<boolean> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, passwordSalt)

    const newElement = {
      accountData: {
        userName: user.accountData.userName,
        passwordHash,
        passwordSalt,
        createdAt: user.accountData.createdAt,
      },
    }
    return await usersRepository.updateUser(user.id, newElement)
  },

  async sendRegistraitonEmail(
    userId: string,
    email: string
  ): Promise<any | null> {
    const updatedObject = {
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
        isConfirmed: false,
      },
    }
    const updatedUser = await usersRepository.updateUserEmailConf(
      userId,
      updatedObject
    )

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
      passwordConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: false,
      },
      deletedTokens: [],
    }

    const userId: string | null = await usersRepository.create({
      ...newElement,
    })
    if (!userId) {
      return null
    }
    return await this.sendRegistraitonEmail(
      userId,
      newElement.accountData.userName.email
    )
  },
}
