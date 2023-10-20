import { ObjectId } from 'mongodb'
import { Types } from 'mongoose'
import {
  type UserDBType,
  type ViewUserType,
  type ViewEmailUserType,
  type ViewCompleteUserType,
  type ResultUser,
} from '../types/types'
import { UserModel } from '../db/db'

const usersFields = [
  'id',
  'login',
  'email',
  'passwordHash',
  'passwordSalt',
  'createdAt',
]

const usersDirections = ['asc', 'desc']

export const usersRepository = {
  async findByPwdCode(code: string): Promise<ViewCompleteUserType | null> {
    const result = await UserModel.findOne({
      'passwordConfirmation.confirmationCode': code,
    })

    if (result) {
      return {
        id: result._id.toString(),
        accountData: {
          userName: {
            login: result.accountData.userName.login,
            email: result.accountData.userName.email,
          },
          passwordHash: result.accountData.passwordHash,
          createdAt: result.accountData.createdAt,
        },
        emailConfirmation: {
          confirmationCode: result.emailConfirmation.confirmationCode,
          expirationDate: result.emailConfirmation.expirationDate,
          isConfirmed: result.emailConfirmation.isConfirmed,
        },
        passwordConfirmation: {
          confirmationCode: result.passwordConfirmation.confirmationCode,
          expirationDate: result.passwordConfirmation.expirationDate,
          isConfirmed: result.passwordConfirmation.isConfirmed,
        },
        deletedTokens: result.deletedTokens,
      }
    } else {
      return null
    }
  },

  async findByCode(code: string): Promise<ViewCompleteUserType | null> {
    const result = await UserModel.findOne({
      'emailConfirmation.confirmationCode': code,
    })

    if (result) {
      return {
        id: result._id.toString(),
        accountData: {
          userName: {
            login: result.accountData.userName.login,
            email: result.accountData.userName.email,
          },
          passwordHash: result.accountData.passwordHash,
          createdAt: result.accountData.createdAt,
        },
        emailConfirmation: {
          confirmationCode: result.emailConfirmation.confirmationCode,
          expirationDate: result.emailConfirmation.expirationDate,
          isConfirmed: result.emailConfirmation.isConfirmed,
        },
        passwordConfirmation: {
          confirmationCode: result.passwordConfirmation.confirmationCode,
          expirationDate: result.passwordConfirmation.expirationDate,
          isConfirmed: result.passwordConfirmation.isConfirmed,
        },
        deletedTokens: result.deletedTokens,
      }
    } else {
      return null
    }
  },

  async findById(id: string): Promise<ViewCompleteUserType | null> {
    const result = await UserModel.findById(id) //.exec()

    if (result) {
      return {
        id: result._id.toString(),
        accountData: {
          userName: {
            login: result.accountData.userName.login,
            email: result.accountData.userName.email,
          },
          passwordHash: result.accountData.passwordHash,
          createdAt: result.accountData.createdAt,
        },
        emailConfirmation:
          // result.emailConfirmation,
          {
            confirmationCode: result.emailConfirmation.confirmationCode,
            expirationDate: result.emailConfirmation.expirationDate,
            isConfirmed: result.emailConfirmation.isConfirmed,
          },
        passwordConfirmation: {
          confirmationCode: result.passwordConfirmation.confirmationCode,
          expirationDate: result.passwordConfirmation.expirationDate,
          isConfirmed: result.passwordConfirmation.isConfirmed,
        },
        deletedTokens: result.deletedTokens,
      }
    } else {
      return null
    }
  },

  async deleteAll(): Promise<boolean> {
    await UserModel.deleteMany({})
    const totalCount = await UserModel.countDocuments({})
    return totalCount === 0
  },
  async findAllUsers(
    searchLoginTerm: string | undefined,
    searchEmailTerm: string | undefined,
    sortBy: string | undefined,
    sortDirection: string | undefined,
    pageNumber: string | undefined,
    pageSize: string | undefined
  ): Promise<ResultUser> {
    const searchLogin = searchLoginTerm ? searchLoginTerm : ''
    const searchEmail = searchEmailTerm ? searchEmailTerm : ''
    // -----
    let sortField = 'accountData.createdAt'
    if (sortBy && usersFields.includes(sortBy)) {
      if (sortBy === 'login') sortField = 'accountData.userName.login'
      if (sortBy === 'email') sortField = 'accountData.userName.email'
    }
    // ------
    const sortString =
      sortDirection && usersDirections.includes(sortDirection)
        ? sortDirection
        : 'desc'
    const sortValue = sortString === 'desc' ? -1 : 1
    const sortObject: any = {}
    sortObject[sortField] = sortValue
    const numberOfPage =
      pageNumber && Number.isInteger(+pageNumber) ? +pageNumber : 1
    const size = pageSize && Number.isInteger(+pageSize) ? +pageSize : 10
    const skipElements = (numberOfPage - 1) * size

    const items = await UserModel.find({
      $or: [
        {
          'accountData.userName.login': {
            $regex: searchLogin,
            $options: 'i',
          },
        },
        {
          'accountData.userName.email': {
            $regex: searchEmail,
            $options: 'i',
          },
        },
      ],
    })
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .lean()

    const totalCount = await UserModel.countDocuments({
      $or: [
        {
          'accountData.userName.login': { $regex: searchLogin, $options: 'i' },
        },
        {
          'accountData.userName.email': { $regex: searchEmail, $options: 'i' },
        },
      ],
    })
    const pagesCount = Math.ceil(totalCount / size)

    return {
      pagesCount,
      page: numberOfPage,
      pageSize: size,
      totalCount,
      items: items.map((i) => ({
        id: i._id.toString(),
        login: i.accountData.userName.login,
        email: i.accountData.userName.email,
        createdAt: i.accountData.createdAt.toISOString(),
      })),
    }
  },

  async findByLogin(login: string): Promise<ViewUserType | null> {
    const result = await UserModel.findOne({
      'accountData.userName.login': login,
    })
    if (result) {
      return {
        id: result._id.toString(),
        login: result.accountData.userName.login,
        email: result.accountData.userName.email,
        createdAt: result.accountData.createdAt.toISOString(),
      }
    } else {
      return null
    }
  },
  async findByEmail(email: string): Promise<ViewEmailUserType | null> {
    const result = await UserModel.findOne({
      'accountData.userName.email': email,
    })
    if (result) {
      return {
        id: result._id.toString(),
        login: result.accountData.userName.login,
        email: result.accountData.userName.email,
        createdAt: result.accountData.createdAt.toISOString(),
        confirmationCode: result.emailConfirmation.confirmationCode,
        expirationDate: result.emailConfirmation.expirationDate,
        isConfirmed: result.emailConfirmation.isConfirmed,
      }
    } else {
      return null
    }
  },

  async findUserByLoginOrEmail(
    loginOrEmail: string
  ): Promise<UserDBType | null> {
    const result = await UserModel.findOne({
      $or: [
        { 'accountData.userName.login': loginOrEmail },
        { 'accountData.userName.email': loginOrEmail },
      ],
    })

    return result
  },
  async delete(id: string): Promise<boolean | null> {
    try {
      if (!Types.ObjectId.isValid(id)) return null
      const result = await UserModel.deleteOne({ _id: new ObjectId(id) })
      console.log('258++users.repo--результат удвления юзера', result)

      return result.deletedCount === 1
    } catch (e) {
      console.log('257---catch', e)

      return null
    }
  },

  async create(newElement: UserDBType): Promise<string> {
    const user = new UserModel({ ...newElement })
    const result = await user.save()
    return result.id
  },

  async updateUser(id: string, newElement: any): Promise<boolean> {
    // const user = await UserModel.findById(id)

    const updated = await UserModel.updateOne(
      { _id: id },
      {
        $set: { ...newElement },
      }
    )

    return updated.matchedCount === 1
  },

  async updateUserEmailConf(id: string, newElement: any): Promise<boolean> {
    // const user = await UserModel.findById(id)

    const updated = await UserModel.updateOne(
      { _id: id },
      {
        $set: { ...newElement },
      }
    )

    return updated.matchedCount === 1
  },

  async updateUserPwdConf(id: string, newElement: any): Promise<boolean> {
    const updated = await UserModel.updateOne(
      { _id: id },
      {
        $set: { ...newElement },
      }
    )

    return updated.matchedCount === 1
  },
}
