import { type ViewBlogType, BlogDBType, ResultBlog } from '../types/types'
import { blogsCollection } from '../db/db'
import { ObjectId } from 'mongodb'

const blogsFields = [
  'id',
  'name',
  'description',
  'websiteUrl',
  'createdAt',
  'isMembership',
]

const blogsDirections = ['asc', 'desc']

export const blogsRepository = {
  async deleteAll(): Promise<boolean> {
    await blogsCollection.deleteMany({})
    const totalCount = await blogsCollection.countDocuments({})
    return totalCount === 0
  },

  async findAll(
    searchNameTerm: string | undefined,
    sortBy: string | undefined,
    sortDirection: string | undefined,
    pageNumber: string | undefined,
    pageSize: string | undefined
  ): Promise<ResultBlog> {
    // Promise<BlogType[] | undefined> {

    const searchName = searchNameTerm ? searchNameTerm : ''
    // -----
    const sortField =
      sortBy && blogsFields.includes(sortBy) ? sortBy : 'createdAt'
    const sortString =
      sortDirection && blogsDirections.includes(sortDirection)
        ? sortDirection
        : 'desc'
    const sortValue = sortString === 'desc' ? -1 : 1
    const sortObject: any = {}
    sortObject[sortField] = sortValue
    // ------
    // TODO: проверить общее количество элементов в коллекции
    // если меньше, то поставить соответствующий skipElements
    // ------
    const numberOfPage =
      pageNumber && Number.isInteger(+pageNumber) ? +pageNumber : 1
    const size = pageSize && Number.isInteger(+pageSize) ? +pageSize : 10
    const skipElements = (numberOfPage - 1) * size

    const items = await blogsCollection
      .find({ name: { $regex: searchName, $options: 'i' } })
      .sort(sortObject)
      .skip(skipElements)
      .limit(size)
      .toArray()
    const totalCount = await blogsCollection.countDocuments({
      name: { $regex: searchName, $options: 'i' },
    })
    const pagesCount = Math.ceil(totalCount / size)
    const resultArray = []

    const result = items.map((el) => {
      return {
        id: el._id.toString(),
        name: el.name,
        description: el.description,
        websiteUrl: el.websiteUrl,
        createdAt: el.createdAt,
        isMembership: el.isMembership,
      }
    })
    return {
      pagesCount,
      page: numberOfPage,
      pageSize: size,
      totalCount,
      items: result,
    }
  },

  async findById(id: string): Promise<ViewBlogType | null> {
    const result = await blogsCollection.findOne({ _id: new ObjectId(id) })
    if (result) {
      return {
        id: result._id.toString(),
        name: result.name,
        description: result.description,
        websiteUrl: result.websiteUrl,
        createdAt: result.createdAt,
        isMembership: result.isMembership,
      }
    } else {
      return null
    }
  },
  async delete(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) })

    return result.deletedCount === 1
  },
  async update(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name,
          description: description,
          websiteUrl: websiteUrl,
        },
      }
    )

    if (result.matchedCount === 1) {
      return true
    } else {
      return false
    }
  },
  async create(newElement: BlogDBType): Promise<ViewBlogType | null> {
    const result = await blogsCollection.insertOne({ ...newElement })
    if (result.acknowledged) {
      return {
        id: result.insertedId.toString(),
        name: newElement.name,
        description: newElement.description,
        websiteUrl: newElement.websiteUrl,
        createdAt: newElement.createdAt,
        isMembership: newElement.isMembership,
      }
    } else {
      return null
    }
  },
}
