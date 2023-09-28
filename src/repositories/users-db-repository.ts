import {
  type UserDBType,
  type ViewUserType,
  type ResultUser,
} from '../db/types'
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
  async deleteAll(): Promise<boolean> {
    await usersCollection.deleteMany({})
    const totalCount = await blogsCollection.countDocuments({})
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
          login: { $regex: searchLogin, $options: 'i' },
          email: { $regex: searchEmail, $options: 'i' },
        },
        { projection: { _id: 0 } }
      )
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .toArray()
    const totalCount = await usersCollection.countDocuments({
      login: { $regex: searchLogin, $options: 'i' },
      email: { $regex: searchEmail, $options: 'i' },
    })
    const pagesCount = Math.ceil(totalCount / size)
    return {
      pagesCount,
      page: numberOfPage,
      pageSize: size,
      totalCount,
      items: items.map((i) => ({
        id: i.id,
        login: i.login,
        email: i.email,
        createdAt: i.createdAt,
      })),
    }
  },

  async findByLogin(login: string): Promise<UserDBType | null> {
    return await usersCollection.findOne(
      { login: login },
      { projection: { _id: 0 } }
    )
  },
  async findByEmail(email: string): Promise<UserDBType | null> {
    return await usersCollection.findOne(
      { email: email },
      { projection: { _id: 0 } }
    )
  },
  async findUserByLoginOrEmail(
    loginOrEmail: string
  ): Promise<UserDBType | null> {
    return await usersCollection.findOne(
      { $or: [{ login: loginOrEmail }, { email: loginOrEmail }] },
      { projection: { _id: 0 } }
    )
  },
  async delete(id: string): Promise<boolean> {
    const result = await usersCollection.deleteOne({ id })

    return result.deletedCount === 1
  },

  async create(newElement: UserDBType): Promise<ViewUserType | null> {
    const created = await usersCollection.insertOne({ ...newElement })
    if (created.acknowledged) {
      return {
        id: created.insertedId.toString(),
        login: newElement.login,
        email: newElement.email,
        createdAt: newElement.createdAt,
      }
    } else {
      return null
    }
  },
}
