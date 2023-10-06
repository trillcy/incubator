import { ObjectId } from 'mongodb'

import {
  type UserDBType,
  type ViewUserType,
  type ViewEmailUserType,
  type ViewCompleteUserType,
  type ResultUser,
} from '../types/types'
import { blogsCollection, usersCollection } from '../db/db'

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
    const result = await usersCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    })
    console.log('28+++users', result)

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
      }
    } else {
      return null
    }
  },

  async findById(id: ObjectId): Promise<ViewUserType | null> {
    const result = await usersCollection.findOne(
      { _id: id }
      // { projection: { _id: 0 } }
    )
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

  async deleteAll(): Promise<boolean> {
    await usersCollection.deleteMany({})
    const totalCount = await usersCollection.countDocuments({})
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

    const items = await usersCollection
      .find(
        {
          $or: [
            {
              login: { $regex: searchLogin, $options: 'i' },
            },
            { email: { $regex: searchEmail, $options: 'i' } },
          ],
        }
        // { projection: { _id: 0 } }
      )
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .toArray()
    const totalCount = await usersCollection.countDocuments({
      $or: [
        {
          login: { $regex: searchLogin, $options: 'i' },
        },
        { email: { $regex: searchEmail, $options: 'i' } },
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
    const result = await usersCollection.findOne(
      { 'accountData.userName.login': login }
      // { projection: { _id: 0 } }
    )
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
    const result = await usersCollection.findOne({
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
    const result = await usersCollection.findOne({
      $or: [
        { 'accountData.userName.login': loginOrEmail },
        { 'accountData.userName.email': loginOrEmail },
      ],
    })

    return result
  },
  async delete(id: string): Promise<boolean | null> {
    try {
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })

      return result.deletedCount === 1
    } catch (e) {
      return null
    }
  },

  async create(newElement: UserDBType): Promise<ViewUserType | null> {
    const created = await usersCollection.insertOne({ ...newElement })

    if (created.acknowledged) {
      return {
        id: created.insertedId.toString(),
        login: newElement.accountData.userName.login,
        email: newElement.accountData.userName.email,
        createdAt: newElement.accountData.createdAt.toISOString(),
      }
    } else {
      return null
    }
  },
  async updateUser(id: ObjectId, newElement: any): Promise<boolean> {
    const updated = await usersCollection.updateOne(
      { _id: id },
      { $set: newElement }
    )
    return updated.acknowledged
  },
}
