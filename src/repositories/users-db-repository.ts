import { ObjectId } from 'mongodb'

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
  async findByCode(code: string): Promise<ViewCompleteUserType | null> {
    console.log('25+++user.repo-code', code)

    const result = await UserModel.findOne({
      emailConfirmation: { confirmationCode: code },
    })
    console.log('30+++users.result', result)

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
        deletedTokens: result.deletedTokens,
      }
    } else {
      return null
    }
  },

  async findById(id: string): Promise<ViewCompleteUserType | null> {
    console.log('54+++user.repo', id)

    const result = await UserModel.findById(id) //.exec()
    console.log('60+++user.repo', result)

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
    const sortField =
      sortBy && usersFields.includes(sortBy) ? sortBy : 'createdAt'
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

    const items = await UserModel.find(
      {
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
      }
      // { projection: { _id: 0 } }
    )
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .lean()
    console.log('127+++usrs', searchLogin, searchEmail)
    console.log('128+++usrs', items)

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
    console.log('200+++user', loginOrEmail)

    const result = await UserModel.findOne({
      $or: [
        { 'accountData.userName.login': loginOrEmail },
        { 'accountData.userName.email': loginOrEmail },
      ],
    })
    console.log('206+++user', result)

    return result
  },
  async delete(id: string): Promise<boolean | null> {
    try {
      const result = await UserModel.deleteOne({ _id: new ObjectId(id) })

      return result.deletedCount === 1
    } catch (e) {
      return null
    }
  },

  async create(newElement: UserDBType): Promise<string> {
    const user = new UserModel({ ...newElement })
    const result = await user.save()
    // console.log('user.repo--create===result', result.id, result.accountData)
    return result.id
  },

  async updateUser(id: string, newElement: any): Promise<boolean> {
    // const user = await UserModel.findById(id)
    console.log('232+++users.repo', newElement)

    const updated = await UserModel.updateOne(
      { _id: id },
      {
        $set: newElement,
      }
    )
    console.log('231++user.repo', updated)

    return updated.matchedCount === 1
  },

  async updateUserEmailConf(id: string, newElement: any): Promise<boolean> {
    // const user = await UserModel.findById(id)
    console.log('232+++users.repo', newElement)

    const updated = await UserModel.updateOne(
      { _id: id },
      {
        $set: { ...newElement },
      }
    )
    console.log('231++user.repo', updated)

    return updated.matchedCount === 1
  },
}
